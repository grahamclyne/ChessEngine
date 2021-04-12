include("util.jl")
include("magic.jl")
include("game.jl")
include("check.jl")
function whatPieceWasThere(move)
end

function generatePossibleMoves(moves,f1,piece,type)
    possible_moves = []
    for index in 1:64
        el = getBit(moves,index)
        if(el == 1)
            start = f1(index) 
            push!(possible_moves, BBToUCI(start,index))
        end
    end
    return possible_moves
end



function getPawnMoves(board,colour::Char,history)
    possible_moves = []
    opp_colour = (colour == 'W') ? 'B' : 'W'
    opposing_pieces = board[opp_colour * 'P'] | board[opp_colour * 'N'] | board[opp_colour * 'B'] | board[opp_colour * 'R'] | board[opp_colour * 'Q'] # omit K to avoid illegal capture
    empty = ~(board[colour * 'P'] | board[colour * 'N'] | board[colour * 'B'] | board[colour * 'R'] | board[colour * 'Q'] | board[colour * 'K'] | opposing_pieces | board[opp_colour * 'K'])
    shift_function = (colour == 'W') ? (x,y) -> x << y  : (x,y) -> x >> y
    last_rank = (colour == 'W') ? RANK_MASKS[8] : RANK_MASKS[1]
    left_side = (colour == 'W') ? FILE_MASKS[1] : FILE_MASKS[8]
    right_side = (colour == 'W') ? FILE_MASKS[8] : FILE_MASKS[1]
    two_forward = (colour == 'W') ? RANK_MASKS[4] : RANK_MASKS[5]
    operator = (colour == 'W') ? (a,b) -> a - b : (a,b) -> a + b
    en_passant = (colour == 'W') ? (a,b) -> a + b : (a,b) -> a - b
    pieces_to_move = board[colour * 'P'] 
    #check for en passant 
    if(length(history) > 0)
        last_move = history[length(history)]
        start_index, end_index = UCIToBB(last_move)

    else
        last_move = missing 
        start_index, end_index = 0,0
    end
    
    if (ismissing(last_move) && (whatPieceWasThere(last_move) == 'P') && abs(end_index - start_index) == 16) #if last move was a pawn moving two sqs
        if (getBit(piecesToMove, end_index + 1) == 1)  #to the right if white, to the left if black
            push!(possible_moves,BBToUCI(end_index + 1, en_passant(end_index, 8)))
        elseif (getBit(piecesToMove, end_index - 1) == 1) 
            push!(possible_moves,BBToUCI(end_index- 1, en_passant(end_index, 8)))
        end
    end

    #capture right
    moves_right = shift_function(pieces_to_move, 7) & opposing_pieces & (~last_rank) & (~right_side)
    f1 = num -> operator(num,7)    
    possible_moves = append!(possible_moves, generatePossibleMoves(moves_right,f1,'P','N'))
    #capture left
    cap_left = shift_function(pieces_to_move, 9) & opposing_pieces & ~last_rank & ~left_side
    f1 = num -> operator(num,9)
    possible_moves = append!(possible_moves,generatePossibleMoves(cap_left, f1,'P', 'N'))
    #1 forward
    one_forward = shift_function(pieces_to_move, 8) & empty & ~(last_rank)
    f1 = num -> operator(num, 8)
    possible_moves = append!(possible_moves,generatePossibleMoves(one_forward,f1,'P','N'))
    #2 forward
    two_forward = shift_function(pieces_to_move, 16) & (empty) & shift_function(empty,8) & two_forward
    f1 = num -> operator(num,16)
    possible_moves = append!(possible_moves,generatePossibleMoves(two_forward, f1,'P', 'N'))
    #pawn promotion by capture right
    promo_right = shift_function(pieces_to_move, 7) & (opposing_pieces) & last_rank & ~right_side
    f1 = num -> operator(num, 7)
    possible_moves = append!(possible_moves,generatePossibleMoves(promo_right, f1,  'P', 'P')) 
    #pawn promotion by 1 forward
    promo_forward = shift_function(pieces_to_move, 8) & empty & last_rank
    f1 = num -> operator(num, 8)
    possible_moves = append!(possible_moves,generatePossibleMoves(promo_forward, f1, 'P', 'P'))
    #pawn promotion by capture left
    promo_cap_left = shift_function(pieces_to_move, 9) & opposing_pieces & last_rank & ~left_side
    f1 = num -> operator(num, 9)
    possible_moves = append!(possible_moves,generatePossibleMoves(promo_cap_left, f1, 'P', 'P'))
    return possible_moves
end

function pawnAttacks(pawn_board,colour)
    attacks = 0
    if (colour == 'W')
        attacks |= (pawn_board << 7) & ~FILE_MASKS[8]
        attacks |= (pawn_board << 9) & ~FILE_MASKS[1]
    else
        attacks |= (pawn_board >> 7) & ~FILE_MASKS[1]
        attacks |= (pawn_board >> 9) & ~FILE_MASKS[8]
    end
    return [[attacks, 0, "P"]]
end

function rookMoves(occ, sq)
#could use whole occupancy board,but would map to too many possibilties, following line gives us a reduced occupancy that is much more manageable
#use same magic number while instantiating rook_moves array as for rook_magic_numbers
    # occ1 = occ
    # occ &= rMask(sq)
    # occ *= rook_magic_numbers[sq]
    # occ >>= (64 - n_r_bits[sq])
    # return rook_attacks[sq][occ]
    return rookAttacksOnTheFly(occ,sq)
end

function bishopMoves(occ,sq)
    return bishopAttacksOnTheFly(occ,sq)
    # occ &= bMask(sq)
    # occ *= bishop_magic_numbers[sq]
    # occ >>= (64 - n_b_bits[sq])
    # return bishop_attacks[sq+1][occ+1]
end


function knightMoves(sq)
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
    # occ &= rMask(sq)
    # occ *= magic_r[sq]
    # occ >>= (64 - n_r_bits[sq])
    return bishopAttacksOnTheFly(occ,sq) | rookAttacksOnTheFly(occ,sq)
end

function kingMoves(sq)
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

function getPieceMoves(board,occ,pieces,f,piece_name)
    if(board == 0)
        return []
    end
    piece_1 = mostSignificantBit(board) 
    piece_2 = leastSignificantBit(board)
    if(piece_1 == piece_2)
        return [[f(occ,piece_1) & ~pieces,piece_1,piece_name]]
    else
        return [[f(occ,piece_1) & ~pieces, piece_1, piece_name],[f(occ,piece_2) & ~pieces, piece_2, piece_name]]
    end
end

function covertMovesToList(board,piece,piece_name)
    return generatePossibleMoves(board, piece, piece_name, 'N')
end



#outward facing call to games.jl
function getMovesUCI(board,colour,history)
    occ = reduce((x,y) -> x | y, values(board))
    opp_colour = (colour == 'W') ? 'B' : 'W'
    pieces =  board[colour * 'P'] | board[colour * 'N'] | board[colour * 'B'] | board[colour * 'R'] | board[colour * 'Q'] | board[colour * 'K']
    moves = append!(
        getPieceMoves(board[colour * 'K'],occ,pieces,(x,y) -> kingMovesActual(y, getAttackBoard(opp_colour, board, true), pieces), 'K'),
        getPieceMoves(board[colour * 'Q'],occ,pieces,queenMoves,'Q'),
        getPieceMoves(board[colour *'N'],occ,pieces,(x,y) -> knightMoves(y), 'N'),
        getPieceMoves(board[colour * 'B'],occ,pieces,bishopMoves,'B'),
        getPieceMoves(board[colour * 'R'],occ,pieces,rookMoves,'R')
        )
    moves_fin = []
    for i in 1:length(moves)
        moves_fin = append!(moves_fin, convertMovesToList(moves[i][1], moves[i][2], moves[i][3]))
    end
    moves_fin = append!(moves_fin,getPawnMoves(board,colour,history))
    moves_no_check = findNoCheckMoves(moves_fin,board,colour)
    moves_with_castle = append!(castleMoves(occ,history,colour,board),moves_no_check)
    return moves_with_castle
end

function convertMovesToList(board, piece, pieceName) 
    return generatePossibleMoves(board, x -> piece, pieceName, "N")
end

function findNoCheckMoves(moves,board,colour)
    moves_no_check = []
    for move in moves
        board_state = makeMoveUCI(move,board,colour)
        c = isCheck(colour,board_state)
        if(~c)
            push!(moves_no_check,move)
        end
    end
    return moves
end

function getAttackBoard(colour,board,for_king)
    occ = reduce((x,y) -> x | y,values(board))
    opp_colour = (colour == 'W') ? 'B' : 'W'
    occ = (for_king) ? occ &= ~board[opp_colour * 'K'] : occ
    pieces = 0
    moves = append!(
        getPieceMoves(board[colour * 'K'],occ,pieces,(x,y) -> kingMoves(y), 'K'),
        getPieceMoves(board[colour * 'Q'],occ,pieces,queenMoves,'Q'),
        getPieceMoves(board[colour *'N'],occ,pieces,(x,y) -> knightMoves(y), 'N'),
        getPieceMoves(board[colour * 'B'],occ,pieces,bishopMoves,'B'),
        getPieceMoves(board[colour * 'R'],occ,pieces,rookMoves,'R'),
        pawnAttacks(board[colour * 'P'],colour)
        )
    moves = map(x -> x[1], moves)

    return reduce((x,y) -> x|y, moves)
end

function castleMoves(occ,history,colour,board)
    moves = []
    rook_pos = (colour == 'W') ? 7 : 63
    opp_colour = (colour == 'W') ? 'B' : 'W'
    to_move = (colour == 'W') ? setBitRange(0,6,7) : setBitRange(0,62,63)  
    king_pos = (colour == 'W') ? 4 : 60 
    piece_moved = false

    #kingside
    for move in history
        if(whatPieceWasThere(move) == 'K' || whatPieceWasThere(move) == 'R') #make sure it is correct piece
            piece_moved = true
        end
    end

    if(getBit(occ,king_pos) > 0  && getBit(occ,rook_pos) > 0 && ~piece_moved && (occ & to_move) == 0 && (getAttackBoard(opp_colour,board,false) & to_move) == 0)
         #if both king and rook exist, no pieces between, no challenged squares, no piece has moved
         (colour == 'W') ? push!(moves,"e1g1") : push!(moves,"e8g8")
    #     if (history.includes(false)) {
#         return false
#     }
    end

    #queenside
    rook_pos = (colour == 'W') ? 1 : 57
    king_pos = (colour == 'W') ? 4 : 60
    to_move = (colour == 'W') ? setBitRange(0,2,4) : setBitRange(0,58,60)
    if(getBit(occ,king_pos) > 0 && getBit(occ,rook_pos) > 0 && ~piece_moved && (occ & to_move) == 0 && (getAttackBoard(opp_colour,board,false) & to_move) == 0)
        colour == 'W' ? push!(moves,"e1c1") : push!(moves,"e8c8")
    end
    return moves
end
