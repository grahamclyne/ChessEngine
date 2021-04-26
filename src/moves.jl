module Moves

import Magic
import Util


global bishop_attacks = Magic.initSlidersAttack(true)
global rook_attacks = Magic.initSlidersAttack(false)




function rookMoves(occ, sq)
    #could use whole occupancy board,but would map to too many possibilties, following line gives us a reduced occupancy that is much more manageable
    #use same magic number while instantiating rook_moves array as for rook_magic_numbers    
    if(sq == 0) return 0 end
    occ &= UInt128(Magic.rMask(sq))
    occ *= Magic.rook_magic_numbers[sq] 
    occ >>= (64 - Magic.n_r_bits[sq])
    return rook_attacks[sq][occ]
    end
    
function bishopMoves(occ,sq)
    if(sq == 0) return 0 end
    sq = Int(sq) #i dont know why this is necessary, when sq = 41, some error comes up? 
    occ &= UInt128(Magic.bMask(sq))
    occ *= Magic.bishop_magic_numbers[sq]
    occ >>= (64 - Magic.n_b_bits[sq])
    return bishop_attacks[sq][occ]
end



function generatePossibleMoves(moves,f1,type)
    possible_moves = []
    for index in 1:64
        el = Util.getBit(moves,index)
        if(el == 1)
            start = f1(index) 
            if(type ==='P')
                push!(possible_moves, Util.BBToUCI(start,index) * 'Q')
            else         
                push!(possible_moves, Util.BBToUCI(start,index))
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
    last_rank = (colour === 'W') ? Util.RANK_MASKS[8] : Util.RANK_MASKS[1]
    left_side = (colour === 'W') ? Util.FILE_MASKS[1] : Util.FILE_MASKS[8]
    right_side = (colour === 'W') ? Util.FILE_MASKS[8] : Util.FILE_MASKS[1]
    two_forward = (colour === 'W') ? Util.RANK_MASKS[4] : Util.RANK_MASKS[5]
    operator = (colour === 'W') ? (a,b) -> a - b : (a,b) -> a + b
    en_passant = (colour === 'W') ? (a,b) -> a + b : (a,b) -> a - b
    pieces_to_move = board[colour * 'P'] 
    #check for en passant 
    if(length(history) > 0)
        last_move = history[length(history)]
        start_index, end_index = Util.UCIToBB(last_move)
    else
        last_move = missing 
        start_index, end_index = 0,0
    end
        #if last move was a pawn moving two sqs

    if (~ismissing(last_move) && (Util.getBit(board[opp_colour * 'P'],end_index) == 1) && abs(end_index - start_index) == 16) 
        if (Util.getBit(pieces_to_move & ~Util.FILE_MASKS[1], end_index + 1) == 1)  #to the right if white, to the left if black
            push!(possible_moves,Util.BBToUCI(end_index + 1, en_passant(end_index, 8)))
        elseif (Util.getBit(pieces_to_move & ~Util.FILE_MASKS[8], end_index - 1) == 1) 
            push!(possible_moves,Util.BBToUCI(end_index- 1, en_passant(end_index, 8)))
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
        attacks |= (pawn_board << 7) & ~Util.FILE_MASKS[8]
        attacks |= (pawn_board << 9) & ~Util.FILE_MASKS[1]
    else
        attacks |= (pawn_board >> 7) & ~Util.FILE_MASKS[1]
        attacks |= (pawn_board >> 9) & ~Util.FILE_MASKS[8]
    end
    return [[attacks, 0, "P"]]
end

function pawnAttacksFast(pawn_board,colour)
    if(pawn_board == 0) return 0 end
    attacks = 0
    if (colour === 'W')
        attacks |= (pawn_board << 7) & ~Util.FILE_MASKS[8]
        attacks |= (pawn_board << 9) & ~Util.FILE_MASKS[1]
    else
        attacks |= (pawn_board >> 7) & ~Util.FILE_MASKS[1]
        attacks |= (pawn_board >> 9) & ~Util.FILE_MASKS[8]
    end
    return attacks
end


function knightMoves(sq)
    if(sq == 0) return 0 end

    attacks = 0
    board = Util.setBit(0,sq,1)
    if ((board >> 17) & ~Util.FILE_MASKS[8] > 0) attacks |= (board >> 17) end
    if ((board >> 15) & ~Util.FILE_MASKS[1] > 0) attacks |= (board >> 15) end
    if ((board >> 10) & ~Util.FILE_MASKS[8] & ~Util.FILE_MASKS[7] > 0) attacks |= (board >> 10) end
    if ((board >> 6) & ~Util.FILE_MASKS[1] & ~Util.FILE_MASKS[2] > 0 ) attacks |= (board >> 6) end
    if ((board << 17) & ~Util.FILE_MASKS[1] > 0 ) attacks |= (board << 17) end
    if ((board << 15) & ~Util.FILE_MASKS[8] > 0 ) attacks |= (board << 15) end
    if ((board << 10) & ~Util.FILE_MASKS[1] & ~Util.FILE_MASKS[2] > 0) attacks |= (board << 10) end
    if ((board << 6) & ~Util.FILE_MASKS[8] & ~Util.FILE_MASKS[7] > 0) attacks |= (board << 6) end
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
    if ((board >> 1) & ~Util.FILE_MASKS[8] > 0 ) attacks |= (board >> 1) end
    if ((board >> 7) & ~Util.FILE_MASKS[1] > 0 ) attacks |= (board >> 7) end
    attacks |= (board >> 8) 
    if ((board >> 9) & ~Util.FILE_MASKS[8] > 0 ) attacks |= (board >> 9) end 
    if ((board << 1) & ~Util.FILE_MASKS[1] > 0 ) attacks |= (board << 1) end 
    if ((board << 7) & ~Util.FILE_MASKS[8] > 0) attacks |= (board << 7) end 
    attacks |= (board << 8) 
    if ((board << 9) & ~Util.FILE_MASKS[1] > 0 ) attacks |= (board << 9) end
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
    piece_1 = Util.mostSignificantBit(board) 
    piece_2 = Util.leastSignificantBit(board) + 1

    if((piece_1 == piece_2) )
        moves = f(occ,piece_1) & ~pieces
        while(moves > 0)
            index = Util.leastSignificantBit(moves) 
            moves = Util.popBit(moves, index)
            push!(ar,Util.BBToUCI(piece_1,index + 1))
        end
    else
        moves = f(occ,piece_1) & ~pieces
        while(moves > 0)
            index = Util.leastSignificantBit(moves)
            moves = Util.popBit(moves, index )
            push!(ar,Util.BBToUCI(piece_1,index +1))
        end
        moves = f(occ,piece_2) & ~pieces
        while(moves > 0)
            index = Util.leastSignificantBit(moves)
            moves = Util.popBit(moves, index )
            push!(ar,Util.BBToUCI(piece_2,index + 1))
        end
    end
    return ar
end

function getMoves(board,colour,history)
    occ = reduce((x,y) -> x | y, values(board))
    opp_colour = (colour === 'W') ? 'B' : 'W'
    pieces =  board[colour * 'P'] | board[colour * 'N'] | board[colour * 'B'] | board[colour * 'R'] | board[colour * 'Q'] | board[colour * 'K']
    moves = append!(
        getPieceMovesFast(board[colour * 'K'],occ,pieces,(x,y) -> kingMovesActual(y, getAttackBoard(board,opp_colour, true), pieces)),
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


function findNoCheckMoves(moves,board::Dict,colour::Char)::Array{String}
    moves_no_check = []
  #  moves_no_check = Array{String}(undef,length(moves))
    for index in 1:length(moves)
        #just look for pinned pieces
        start_index,end_index = Util.UCIToBB(moves[index])
        key1 = ""
        key2 = ""
        temp1 = 0
        temp2 = 0
        for key in keys(board)
            if(board[key] & (1 << (start_index - 1)) > 0)
                temp1 = board[key]
                key1 = key
                board[key] = Util.setBit(board[key], start_index,0)
                board[key] = Util.setBit(board[key],end_index,1)
            elseif(board[key] & (1 << (end_index - 1)) > 0 && ~('K' in key))
                temp2 = board[key]
                key2 = key
                board[key] = Util.setBit(board[key], end_index,0)
            end
        end
        if(~isCheck(board,colour))
            push!(moves_no_check,moves[index])
        end
        #undo moves
        if(key1 !== "")
        board[key1] = temp1
        end
        if(key2 !== "")
        board[key2] = temp2
        end
    end
    return moves_no_check
end

function getAttackBoard(board,colour,for_king)
    occ = reduce((x,y) -> x | y,values(board))
    opp_colour = (colour === 'W') ? 'B' : 'W'

    occ = (for_king) ? occ &= ~(board[opp_colour * 'K']) : occ
    pieces =  board[colour * 'P'] | board[colour * 'N'] | board[colour * 'B'] | board[colour * 'R'] | board[colour * 'Q'] | board[colour * 'K']
    attacks = 0
    for key in keys(board)
        temp = board[key]
        while(temp > UInt64(0))
            piece_1 = Util.leastSignificantBit(temp) + 1
            piece_2 = Util.mostSignificantBit(temp) 
            temp = Util.popBit(temp,piece_1 - UInt64(1))
            temp = Util.popBit(temp,piece_2 - UInt64(1))
            #this is separated out, as using * for string concat is slow.... 
            if(colour == 'W')
                if("WQ" ===  key)
                    attacks |= queenMoves(occ,piece_1) & ~pieces
                elseif("WK" === key)
                    attacks |= kingMoves(piece_1) & ~pieces
                elseif("WB" === key)
                    attacks |= bishopMoves(occ,piece_1) & ~pieces
                    attacks |= bishopMoves(occ,piece_2) & ~pieces
                elseif("WN" === key)
                    attacks |= knightMoves(piece_1) & ~pieces
                    attacks |= knightMoves(piece_2) & ~pieces
                elseif("WR" === key)
                    attacks |= rookMoves(occ,piece_1) & ~pieces
                    attacks |= rookMoves(occ,piece_2) & ~pieces
                end
            elseif (colour == 'B')
                if("BQ" === key)
                    attacks |= queenMoves(occ,piece_1) & ~pieces
                elseif("BK" === key)
                    attacks |= kingMoves(piece_1) & ~pieces
                elseif("BB" === key)
                    attacks |= bishopMoves(occ,piece_1) & ~pieces
                    attacks |= bishopMoves(occ,piece_2) & ~pieces
                elseif( "BN" === key)
                    attacks |= knightMoves(piece_1) & ~pieces
                    attacks |= knightMoves(piece_2) & ~pieces
                elseif("BR" === key)
                    attacks |= rookMoves(occ,piece_1) & ~pieces
                    attacks |= rookMoves(occ,piece_2) & ~pieces
                end
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
    to_move = (colour === 'W') ? Util.setBitRange(0,6,7) : Util.setBitRange(0,62,63)  
    king_pos = (colour === 'W') ? 5 : 61
    piece_moved = false
    for move in history
        start_index, end_index = Util.UCIToBB(move)
        if(Util.getBit(board[colour * 'K'],end_index) == 1 || Util.getBit(board[colour * 'R'],end_index) == 1) #make sure it is correct piece
            piece_moved = true
        end
    end

    #kingside
    if(Util.getBit(occ,king_pos) > 0  && Util.getBit(occ,rook_pos) > 0 && ~piece_moved && (occ & to_move) == 0 && (getAttackBoard(board,opp_colour,false) & to_move) == 0)
         #if both king and rook exist, no pieces between, no challenged squares, no piece has moved
         (colour === 'W') ? push!(moves,"e1g1") : push!(moves,"e8g8")
    end

    #queenside
    rook_pos = (colour === 'W') ? 1 : 57
    to_move = (colour === 'W') ? Util.setBitRange(0,2,4) : Util.setBitRange(0,58,60)
    if(Util.getBit(occ,king_pos) > 0 && Util.getBit(occ,rook_pos) > 0 && ~piece_moved && (occ & to_move) == 0 && (getAttackBoard(board,opp_colour,false) & to_move) == 0)
        colour === 'W' ? push!(moves,"e1c1") : push!(moves,"e8c8")
    end
    return moves
end

########### CHECK LOGIC ###############



function isCheck(board,colour)
    opp_colour = (colour === 'W') ? 'B' : 'W'
    attack = getAttackBoard(board,opp_colour,true)
    return ((board[colour * 'K'] & attack) > 0) ? true : false
end



function isCheckMate(board,colour,history)
    check = isCheck(board,colour)
    legal_moves = getMoves(board,colour,history)
    while(check && (length(legal_moves) > 0))
        move = legal_moves[1]
        board_state = makeMoveUCI(move,board,colour)
        if(!isCheck(board_state,colour))
            check = false
        else
            popfirst!(legal_moves)
        end
    end
    if (length(legal_moves) == 0 && check)
        return 1
    elseif (length(legal_moves) == 0 && ~check) #stalemate
        return 2
    else
        return 0
    end
end


function makeMoveUCI(move,board,colour)
    output = copy(board)
    start_index, end_index = Util.UCIToBB(move)
    #see if cap
    is_capture = false
    for key in keys(board)
        if(board[key] & (1 << (end_index - 1)) > 0 && (board[key] & (1 << (start_index - 1))) == 0)
            output[key] = Util.setBit(board[key],end_index,0)
            is_capture = true
            break
        end
    end
    for (key,value) in board
        if (Util.getBit(value,start_index) === UInt64(1))
            #if en passant
            if ('P' in key && ~is_capture && abs(end_index - start_index) !== UInt64(8) && abs(end_index - start_index) !== UInt64(16))
                if(colour === 'W')
                     output["BP"] = Util.setBit(board["BP"], end_index - 8, 0)
                else
                     output["WP"] = Util.setBit(board["WP"], end_index + 8,0)
                end
            #if castle
            elseif ('K' in key)
                if (move === "e1g1")
                     output["WR"] = Util.setBit(board["WR"],8,0)
                     output["WR"] = Util.setBit(output["WR"],6,1)
                elseif (move === "e1c1")
                    output["WR"] = Util.Util.setBit(board["WR"],1,0)
                    output["WR"] = Util.setBit(output["WR"],4,1)
                elseif (move === "e8g8")
                    output["BR"] = Util.setBit(board["BR"],64,0)
                    output["BR"] = Util.setBit(output["BR"],62,1)
                elseif (move === "e8c8")
                    output["BR"] = Util.setBit(board["BR"],57,0)
                    output["BR"] = Util.setBit(output["BR"],60,1)
                end
            end
            output[key] = Util.setBit(output[key],start_index,0)
            output[key] = Util.setBit(output[key],end_index,1)
        end
   
    end
    if(length(move) === 5) #pawn promotion
        output[colour * 'P'] = Util.setBit(board[colour * 'P'], start_index,0)
        output[colour * move[5]] = Util.setBit(board[colour * move[5]],end_index,1)
        return output
    end
    return output
end



end