
module Search

import Moves
import Util 


global node_count = 0

function staticEvaluation(board,mobility,colour)
    opp_colour = (colour == 'W') ? 'B' : 'W'
    score = count_ones(board[colour * 'P']) - count_ones(board[opp_colour * 'P'])
    score = score + (3 * (count_ones(board[colour * 'N']) + count_ones(board[colour * 'B']) - (count_ones(board[opp_colour * 'N']) + count_ones(board[opp_colour * 'B']))))
    score = score + (5 * (count_ones(board[colour * 'R']) - count_ones(board[opp_colour * 'R'])))
    score = score + (9 * (count_ones(board[colour * 'Q']) - count_ones(board[opp_colour * 'Q'])))
    score = score + (200 * (count_ones(board[colour * 'K']) - count_ones(board[opp_colour * 'K'])))
    score = score + (0.1 * mobility)
    under_attack = Moves.getAttackBoard(board,colour,false) & Util.getWhitePieces(board)
    opp_under_attack = Moves.getAttackBoard(board,opp_colour,false) & Util.getBlackPieces(board)
    #number of pieces in attack
    score = score + (0.2 * (count_ones(opp_under_attack) - count_ones(under_attack)))
    #find if pieces are protected that are under attack
   # score = score + (0.2 * (count_ones(under_attack & getAttackBoard(board,colour,false)) - count_ones(opp_under_attack & getAttackBoard(board,opp_colour,false))))
    return score
end


function search(depth,colour,history,board)
    global node_count
    w = @time negamax(-Inf,Inf,depth,colour,history,board,0)
    println("weight of move: ", w, ' ', best_move)
    println("nodes explored: ", node_count)
    node_count = 0
end

function negamax(alpha,beta,depth,colour,history,board, ply)
    opp_colour = (colour == 'W') ? 'B' : 'W'
    global node_count = node_count + 1
    #  println(depth,' ',alpha,' ',beta, ' ', moves)
    moves = Moves.getMoves(board,colour,history)
    if(depth == 0)
        #  println("staticEval: ",alpha, " ",beta, " ")
        x = staticEvaluation(board, length(moves),colour)
        # println("return staticEvaluation: ", x)
        return x
    end
 #   node_count = node_count + 1
    old_alpha = alpha
    bestmove_sofar = ""
    for move in moves
        copied = Moves.makeMoveUCI(move,board,colour)
        ply = ply + 1
        score = -negamax(-beta,-alpha,depth-1,opp_colour,history,copied,ply)
        ply = ply - 1
        # println("SCORE after -negamax: ", score, ' ',depth, " ",alpha, " ",beta, " ", move, " ", ply)

        if(score >= beta)
            #  println("returning beta: ", beta )
            return beta
        end
        if(score > alpha) #if better move
            alpha = score
            #   println("updating alpha, " , alpha)
            if(ply == 0)
                # println("updating best move : ", move)
                bestmove_sofar = move
            end
        end
 
    end
    if(old_alpha != alpha)
        global best_move = bestmove_sofar
    end
    if(length(moves) == 0)
        mate = Moves.isCheckMate(board,colour,history)
        if(mate === 1)
            return -100000
        elseif(mate === 2)
            return 0
        end
    end
    return alpha
end

end