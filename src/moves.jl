include("util.jl")
include("magic.jl")
include("game.jl")



function initSlidersAttack(is_bishop)
    attacks = Array{Dict}(undef,64)
    for i in 1:64
        attacks[i] = Dict()
    end
    println("INITIALIZING SLIDER MOVES",is_bishop)
    for sq in 1:64
        attack_mask = (is_bishop) ? bMask(sq) : rMask(sq)
        relevant_bits_count = count_ones(attack_mask)
        occupancy_indicies = (1 << relevant_bits_count)
        for index in 0:occupancy_indicies-1
            if(is_bishop)
                occ = UInt128(setOcc(index,relevant_bits_count,attack_mask))
                magic_index = (occ * bishop_magic_numbers[sq]) >> (64 - n_b_bits[sq])
                attacks[sq][magic_index] = bishopAttacksOnTheFly(occ,sq)
            else
                occ = UInt128(setOcc(index,relevant_bits_count,attack_mask))
                magic_index = (occ * rook_magic_numbers[sq]) >> (64 - n_r_bits[sq]) 
                attacks[sq][magic_index] = rookAttacksOnTheFly(occ,sq)

            end
        end
    end
    return attacks
end



global bishop_attacks = initSlidersAttack(true)
global rook_attacks = initSlidersAttack(false)





function rookMoves(occ, sq)
    #could use whole occupancy board,but would map to too many possibilties, following line gives us a reduced occupancy that is much more manageable
    #use same magic number while instantiating rook_moves array as for rook_magic_numbers    
    if(sq == 0) return 0 end
    occ &= UInt128(rMask(sq))
    occ *= rook_magic_numbers[sq] 
    occ >>= (64 - n_r_bits[sq])
    return rook_attacks[sq][occ]
    end
    
function bishopMoves(occ,sq)
    if(sq == 0) return 0 end
    sq = Int(sq) #i dont know why this is necessary, when sq = 41, some error comes up? 
    occ &= UInt128(bMask(sq))
    occ *= bishop_magic_numbers[sq]
    occ >>= (64 - n_b_bits[sq])
    return bishop_attacks[sq][occ]
end



function generatePossibleMoves(moves,f1,type)
    possible_moves = []
    for index in 1:64
        el = getBit(moves,index)
        if(el == 1)
            start = f1(index) 
            if(type ==='P')
                push!(possible_moves, BBToUCI(start,index) * 'Q')
            else         
                push!(possible_moves, BBToUCI(start,index))
            end
        end
    end
    return possible_moves
end



function getPawnMoves(board,colour::Char,history)
    possible_moves = []
    opp_colour = (colour === 'W') ? 'B' : 'W'
    opposing_pieces = board[opp_colour * 'P'] | board[opp_colour * 'N'] | board[opp_colour * 'B'] | board[opp_colour * 'R'] | board[opp_colour * 'Q'] # omit K to avoid illegal capture
    empty = ~(board[colour * 'P'] | board[colour * 'N'] | board[colour * 'B'] | board[colour * 'R'] | board[colour * 'Q'] | board[colour * 'K'] | opposing_pieces | board[opp_colour * 'K'])
    shift_function = (colour === 'W') ? (x,y) -> x << y  : (x,y) -> x >> y
    last_rank = (colour === 'W') ? RANK_MASKS[8] : RANK_MASKS[1]
    left_side = (colour === 'W') ? FILE_MASKS[1] : FILE_MASKS[8]
    right_side = (colour === 'W') ? FILE_MASKS[8] : FILE_MASKS[1]
    two_forward = (colour === 'W') ? RANK_MASKS[4] : RANK_MASKS[5]
    operator = (colour === 'W') ? (a,b) -> a - b : (a,b) -> a + b
    en_passant = (colour === 'W') ? (a,b) -> a + b : (a,b) -> a - b
    pieces_to_move = board[colour * 'P'] 
    #check for en passant 
    if(length(history) > 0)
        last_move = history[length(history)]
        start_index, end_index = UCIToBB(last_move)
    else
        last_move = missing 
        start_index, end_index = 0,0
    end
        #if last move was a pawn moving two sqs

    if (~ismissing(last_move) && (getBit(board[opp_colour * 'P'],end_index) == 1) && abs(end_index - start_index) == 16) 
        if (getBit(pieces_to_move & ~FILE_MASKS[1], end_index + 1) == 1)  #to the right if white, to the left if black
            push!(possible_moves,BBToUCI(end_index + 1, en_passant(end_index, 8)))
        elseif (getBit(pieces_to_move & ~FILE_MASKS[8], end_index - 1) == 1) 
            push!(possible_moves,BBToUCI(end_index- 1, en_passant(end_index, 8)))
        end
    end

    #capture right
    moves_right = shift_function(pieces_to_move, 7) & opposing_pieces & (~last_rank) & (~right_side)
    f1 = num -> operator(num,7)    
    possible_moves = append!(possible_moves, generatePossibleMoves(moves_right,f1,'N'))
    #capture left
    cap_left = shift_function(pieces_to_move, 9) & opposing_pieces & ~last_rank & ~left_side
    f1 = num -> operator(num,9)
    possible_moves = append!(possible_moves,generatePossibleMoves(cap_left, f1, 'N'))
    #1 forward
    one_forward = shift_function(pieces_to_move, 8) & empty & ~(last_rank)
    f1 = num -> operator(num, 8)
    possible_moves = append!(possible_moves,generatePossibleMoves(one_forward,f1,'N'))
    #2 forward
    two_forward = shift_function(pieces_to_move, 16) & (empty) & shift_function(empty,8) & two_forward
    f1 = num -> operator(num,16)
    possible_moves = append!(possible_moves,generatePossibleMoves(two_forward, f1,'N'))
    #pawn promotion by capture right
    promo_right = shift_function(pieces_to_move, 7) & (opposing_pieces) & last_rank & ~right_side
    f1 = num -> operator(num, 7)
    possible_moves = append!(possible_moves,generatePossibleMoves(promo_right, f1,  'P')) 
    #pawn promotion by 1 forward
    promo_forward = shift_function(pieces_to_move, 8) & empty & last_rank
    f1 = num -> operator(num, 8)
    possible_moves = append!(possible_moves,generatePossibleMoves(promo_forward, f1,  'P'))
    #pawn promotion by capture left
    promo_cap_left = shift_function(pieces_to_move, 9) & opposing_pieces & last_rank & ~left_side
    f1 = num -> operator(num, 9)
    possible_moves = append!(possible_moves,generatePossibleMoves(promo_cap_left, f1,  'P'))
    return possible_moves
end

function pawnAttacks(pawn_board,colour)
    if(pawn_board == 0) return 0 end
    attacks = 0
    if (colour === 'W')
        attacks |= (pawn_board << 7) & ~FILE_MASKS[8]
        attacks |= (pawn_board << 9) & ~FILE_MASKS[1]
    else
        attacks |= (pawn_board >> 7) & ~FILE_MASKS[1]
        attacks |= (pawn_board >> 9) & ~FILE_MASKS[8]
    end
    return [[attacks, 0, "P"]]
end

function pawnAttacksFast(pawn_board,colour)
    if(pawn_board == 0) return 0 end
    attacks = 0
    if (colour === 'W')
        attacks |= (pawn_board << 7) & ~FILE_MASKS[8]
        attacks |= (pawn_board << 9) & ~FILE_MASKS[1]
    else
        attacks |= (pawn_board >> 7) & ~FILE_MASKS[1]
        attacks |= (pawn_board >> 9) & ~FILE_MASKS[8]
    end
    return attacks
end
function knightMoves(sq)
    if(sq == 0) return 0 end

    attacks = 0
    board = 2^(sq - 1)
    if ((board >> 17) & ~FILE_MASKS[8] > 0) attacks |= (board >> 17) end
    if ((board >> 15) & ~FILE_MASKS[1] > 0) attacks |= (board >> 15) end
    if ((board >> 10) & ~FILE_MASKS[8] & ~FILE_MASKS[7] > 0) attacks |= (board >> 10) end
    if ((board >> 6) & ~FILE_MASKS[1] & ~FILE_MASKS[2] > 0 ) attacks |= (board >> 6) end
    if ((board << 17) & ~FILE_MASKS[1] > 0 ) attacks |= (board << 17) end
    if ((board << 15) & ~FILE_MASKS[8] > 0 ) attacks |= (board << 15) end
    if ((board << 10) & ~FILE_MASKS[1] & ~FILE_MASKS[2] > 0) attacks |= (board << 10) end
    if ((board << 6) & ~FILE_MASKS[8] & ~FILE_MASKS[7] > 0) attacks |= (board << 6) end
    return attacks
end

function queenMoves(occ,sq)
    if(sq == 0) return 0 end

    return bishopMoves(occ,sq) | rookMoves(occ,sq)
end

function kingMoves(sq)
    if(sq == 0) return 0 end
    attacks = 0
    board = 2^(sq-1)
    if ((board >> 1) & ~FILE_MASKS[8] > 0 ) attacks |= (board >> 1) end
    if ((board >> 7) & ~FILE_MASKS[1] > 0 ) attacks |= (board >> 7) end
    attacks |= (board >> 8) 
    if ((board >> 9) & ~FILE_MASKS[8] > 0 ) attacks |= (board >> 9) end 
    if ((board << 1) & ~FILE_MASKS[1] > 0 ) attacks |= (board << 1) end 
    if ((board << 7) & ~FILE_MASKS[8] > 0) attacks |= (board << 7) end 
    attacks |= (board << 8) 
    if ((board << 9) & ~FILE_MASKS[1] > 0 ) attacks |= (board << 9) end
    return attacks
end

function kingMovesActual(sq,attack_board,pieces)
    return kingMoves(sq) & ~(attack_board) & ~pieces
end

# function getPieceMoves(board,occ,pieces,f,piece_name)
#     ar = []
#     if(board == 0) #none of this type of piece exist
#         return []
#     end
#     piece_1 = mostSignificantBit(board) 
#     piece_2 = leastSignificantBit(board) + 1

#     if((piece_1 == piece_2) )
#         # moves = f(occ,piece_1) & ~pieces
#         # while(moves > 0)
#         #     index = leastSignificantBit(moves) 
#         #     moves = popBit(moves, index)
#         #     push!(ar,BBToUCI(piece_1,index + 1))
#         # end
#          return [[f(occ,piece_1) & ~pieces,piece_1,piece_name]]
#     else
#         # moves = f(occ,piece_1) & ~pieces
#         # while(moves > 0)
#         #     index = leastSignificantBit(moves)
#         #     moves = popBit(moves, index )
#         #     push!(ar,BBToUCI(piece_1,index +1))
#         # end
#         # moves = f(occ,piece_2) & ~pieces
#         # while(moves > 0)
#         #     index = leastSignificantBit(moves)
#         #     moves = popBit(moves, index )
#         #     push!(ar,BBToUCI(piece_2,index + 1))
#         # end
#          return [[f(occ,piece_1) & ~pieces, piece_1, piece_name],[f(occ,piece_2) & ~pieces, piece_2, piece_name]]
#     end
#     return ar
# end

function getPieceMovesFast(board,occ,pieces,f)
    ar = []
    if(board == 0) #none of this type of piece exist
        return []
    end
    piece_1 = mostSignificantBit(board) 
    piece_2 = leastSignificantBit(board) + 1
    if((piece_1 == piece_2) )
        moves = f(occ,piece_1) & ~pieces
        while(moves > 0)
            index = leastSignificantBit(moves) 
            moves = popBit(moves, index)
            push!(ar,BBToUCI(piece_1,index + 1))
        end
    else
        moves = f(occ,piece_1) & ~pieces
        while(moves > 0)
            index = leastSignificantBit(moves)
            moves = popBit(moves, index )
            push!(ar,BBToUCI(piece_1,index +1))
        end
        moves = f(occ,piece_2) & ~pieces
        while(moves > 0)
            index = leastSignificantBit(moves)
            moves = popBit(moves, index )
            push!(ar,BBToUCI(piece_2,index + 1))
        end
    end
    return ar
end

function getMovesFast(board,colour,history)
    occ = reduce((x,y) -> x | y, values(board))
    opp_colour = (colour === 'W') ? 'B' : 'W'
    pieces =  board[colour * 'P'] | board[colour * 'N'] | board[colour * 'B'] | board[colour * 'R'] | board[colour * 'Q'] | board[colour * 'K']
    moves = append!(
        getPieceMovesFast(board[colour * 'K'],occ,pieces,(x,y) -> kingMovesActual(y, getAttackBoardFast(board,opp_colour, true), pieces)),
        getPieceMovesFast(board[colour * 'Q'],occ,pieces,queenMoves),
        getPieceMovesFast(board[colour *'N'],occ,pieces,(x,y) -> knightMoves(y)),
        getPieceMovesFast(board[colour * 'B'],occ,pieces,bishopMoves),
        getPieceMovesFast(board[colour * 'R'],occ,pieces,rookMoves)
        )
    moves_fin = append!(moves, getPawnMoves(board,colour,history))
    moves_fin = findNoCheckMoves(moves_fin,board,colour)
    moves_with_castle = append!(castleMoves(board,colour,history,occ),moves_fin)
    return moves_with_castle
end


# #outward facing call to games.jl
# function getMovesUCI(board::Dict,colour::Char,history,is_check::Bool)::Array{String}
#     occ = reduce((x,y) -> x | y, values(board))
#     opp_colour = (colour === 'W') ? 'B' : 'W'
#     pieces =  board[colour * 'P'] | board[colour * 'N'] | board[colour * 'B'] | board[colour * 'R'] | board[colour * 'Q'] | board[colour * 'K']
#     moves = append!(
#         getPieceMoves(board[colour * 'K'],occ,pieces,(x,y) -> kingMovesActual(y, getAttackBoardFast(board,opp_colour, true), pieces), 'K'),
#         getPieceMoves(board[colour * 'Q'],occ,pieces,queenMoves,'Q'),
#         getPieceMoves(board[colour *'N'],occ,pieces,(x,y) -> knightMoves(y), 'N'),
#         getPieceMoves(board[colour * 'B'],occ,pieces,bishopMoves,'B'),
#         getPieceMoves(board[colour * 'R'],occ,pieces,rookMoves,'R')
#         )
#     moves_fin = []
#     for i in 1:length(moves)
#         moves_fin = append!(moves_fin, generatePossibleMoves(moves[i][1], x -> moves[i][2], 'N'))
#     end
#     # println(moves_fin)
#     moves_fin = append!(moves_fin, getPawnMoves(board,colour,history))
#     # println(moves_fin)
#     moves_fin = findNoCheckMoves(moves_fin,board,colour)
#     moves_with_castle = append!(castleMoves(board,colour,history,occ),moves_fin)
#     return moves_with_castle
# end


function findNoCheckMoves(moves,board::Dict,colour::Char)::Array{String}
    moves_no_check = []
  #  moves_no_check = Array{String}(undef,length(moves))
    for index in 1:length(moves)
        board_state = makeMoveUCI(moves[index],board,colour)
        if(~isCheck(board_state,colour))
            push!(moves_no_check,moves[index])
        end
    end
    return moves_no_check
end


# function getAttackBoard(board,colour,for_king)
#     occ = reduce((x,y) -> x | y,values(board))
#     opp_colour = (colour === 'W') ? 'B' : 'W'
#     occ = (for_king) ? occ &= ~(board[opp_colour * 'K']) : occ
#     pieces =  board[colour * 'P'] | board[colour * 'N'] | board[colour * 'B'] | board[colour * 'R'] | board[colour * 'Q'] | board[colour * 'K']
#     moves = append!(
#         getPieceMoves(board[colour * 'K'],occ,pieces,(x,y) -> kingMoves(y), 'K'),
#         getPieceMoves(board[colour * 'Q'],occ,pieces,queenMoves,'Q'),
#         getPieceMoves(board[colour *'N'],occ,pieces,(x,y) -> knightMoves(y), 'N'),
#         getPieceMoves(board[colour * 'B'],occ,pieces,bishopMoves,'B'),
#         getPieceMoves(board[colour * 'R'],occ,pieces,rookMoves,'R'),
#         pawnAttacks(board[colour * 'P'],colour)
#         )
#     moves = map(x -> x[1], moves)
#     return reduce((x,y) -> x|y, moves)
# end

function getAttackBoardFast(board,colour,for_king)
    occ = reduce((x,y) -> x | y,values(board))
    opp_colour = (colour === 'W') ? 'B' : 'W'

    occ = (for_king) ? occ &= ~(board[opp_colour * 'K']) : occ
    pieces =  board[colour * 'P'] | board[colour * 'N'] | board[colour * 'B'] | board[colour * 'R'] | board[colour * 'Q'] | board[colour * 'K']
    attacks = 0
    for key in keys(board)
        temp = board[key] & ~pieces
        while(temp > 0)
        piece_1 = leastSignificantBit(temp)
        piece_2 = mostSignificantBit(temp)
        temp = popBit(temp,piece_1)
        temp = popBit(temp,piece_2)
            if(colour * 'Q' ==  key)
                attacks |= queenMoves(occ,piece_1)
            elseif(colour * 'K' == key)
                attacks |= kingMoves(piece_1)
            elseif(colour * 'B' == key)
                attacks |= bishopMoves(occ,piece_1)
                attacks |= bishopMoves(occ,piece_2)
            elseif(colour * 'N' == key)
                attacks |= knightMoves(piece_1)
                attacks |= knightMoves(piece_2)
            elseif(colour * 'R' == key)
                attacks |= rookMoves(occ,piece_1)
                attacks |= rookMoves(occ,piece_2)
            end
        end
    end
    attacks |= pawnAttacksFast(board[colour * 'P'],colour)
    return attacks
    
end
function castleMoves(board,colour,history,occ)
    moves = []
    rook_pos = (colour === 'W') ? 8 : 64
    opp_colour = (colour === 'W') ? 'B' : 'W'
    to_move = (colour === 'W') ? setBitRange(0,6,7) : setBitRange(0,62,63)  
    king_pos = (colour === 'W') ? 5 : 61
    piece_moved = false
    for move in history
        start_index, end_index = UCIToBB(move)
        if(getBit(board[colour * 'K'],end_index) == 1 || getBit(board[colour * 'R'],end_index) == 1) #make sure it is correct piece
            piece_moved = true
        end
    end

    #kingside
    if(getBit(occ,king_pos) > 0  && getBit(occ,rook_pos) > 0 && ~piece_moved && (occ & to_move) == 0 && (getAttackBoardFast(board,opp_colour,false) & to_move) == 0)
         #if both king and rook exist, no pieces between, no challenged squares, no piece has moved
         (colour === 'W') ? push!(moves,"e1g1") : push!(moves,"e8g8")
    end

    #queenside
    rook_pos = (colour === 'W') ? 1 : 57
    to_move = (colour === 'W') ? setBitRange(0,2,4) : setBitRange(0,58,60)
    if(getBit(occ,king_pos) > 0 && getBit(occ,rook_pos) > 0 && ~piece_moved && (occ & to_move) == 0 && (getAttackBoardFast(board,opp_colour,false) & to_move) == 0)
        colour === 'W' ? push!(moves,"e1c1") : push!(moves,"e8c8")
    end
    return moves
end

########### CHECK LOGIC ###############



function isCheck(board,colour)
    opp_colour = (colour === 'W') ? 'B' : 'W'
    attack = getAttackBoardFast(board,opp_colour,true)
    return ((board[colour * 'K'] & attack) > 0) ? true : false
end

function isCheckMate(board,colour,history)
    check = isCheck(board,colour)
    legal_moves = getMovesFast(board,colour,history)
    while(check && length(legal_moves) > 0)
        move = legal_moves[1]
        board_state = makeMoveUCI(move,board,colour)
        if(!isCheck(board_state,colour))
            check = false
        else
            popfirst!(legal_moves)
        end
    end
    if(length(legal_moves) == 0 && check)
        return 1
    elseif (length(legal_moves) == 0 && ~check) #stalemate
        return 2
    else
        return 0
    end
end
