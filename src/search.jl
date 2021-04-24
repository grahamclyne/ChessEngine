
module Search

import Moves
import Util 

function staticEvaluation(board,mobility,colour)
    opp_colour = (colour == 'W') ? 'B' : 'W'
    score = count_ones(board[colour * 'P']) - count_ones(board[colour * 'P'])
    score = score + (3 * (count_ones(board[colour * 'N']) + count_ones(board[colour * 'N']) - (count_ones(board[colour * 'N']) + count_ones(board[colour * 'N']))))
    score = score + (5 * (count_ones(board[colour * 'R']) - count_ones(board[colour * 'R'])))
    score = score + (9 * (count_ones(board[colour * 'Q']) - count_ones(board[colour * 'Q'])))
    score = score + (200 * (count_ones(board[colour * 'K']) - count_ones(board[colour * 'K'])))
    score = score + (0.1 * mobility)
    under_attack = Moves.getAttackBoardFast(board,colour,false) & Util.getWhitePieces(board)
    opp_under_attack = Moves.getAttackBoardFast(board,opp_colour,false) & Util.getBlackPieces(board)
    #number of pieces in attack
    score = score + (0.2 * (count_ones(opp_under_attack) - count_ones(under_attack)))
    #find if pieces are protected that are under attack
   # score = score + (0.2 * (count_ones(under_attack & getAttackBoardFast(board,colour,false)) - count_ones(opp_under_attack & getAttackBoardFast(board,opp_colour,false))))
    return score
end

global best_move = ""
function negamax(alpha,beta,depth,colour,history,board, ply)
    #  println(depth,' ',alpha,' ',beta, ' ', moves)
    moves = Moves.getMovesFast(board,colour,history)
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
        score = -negamax(-beta,-alpha,depth-1,colour,history,copied,ply)
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