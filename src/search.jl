include("moves.jl")

function staticEvaluation(board,mobility)
    score = count_ones(board["WP"]) - count_ones(board["BP"])
    score = score + (3 * (count_ones(board["WN"]) + count_ones(board["WB"]) - (count_ones(board["BN"]) + count_ones(board["BB"]))))
    score = score + (5 * (count_ones(board["WR"]) - count_ones(board["BR"])))
    score = score + (9 * (count_ones(board["WQ"]) - count_ones(board["BQ"])))
    score = score + (200 * (count_ones(board["WK"]) - count_ones(board["BK"])))
#    score = score + (0.1 * mobility)
    white_under_attack = getAttackBoardFast(board,'B',false) & getWhitePieces(board)
    black_under_attack = getAttackBoardFast(board,'W',false) & getBlackPieces(board)
    #number of pieces in attack
    score = score + (0.2 * (count_ones(black_under_attack) - count_ones(white_under_attack)))
    #find if pieces are protected that are under attack
    score = score + (0.2 * (count_ones(white_under_attack & getAttackBoardFast(board,'W',false)) - count_ones(black_under_attack & getAttackBoardFast(board,'B',false))))
    return score
end


function negamax(alpha,beta,depth,colour,history,board, ply)
    #  println(depth,' ',alpha,' ',beta, ' ', moves)
    moves = getMovesFast(board,colour,history)
    if(depth == 0)
        #  println("staticEval: ",alpha, " ",beta, " ")
        x = staticEvaluation(board, length(moves))
        # println("return staticEvaluation: ", x)
        return x
    end

 #   node_count = node_count + 1
    old_alpha = alpha
    bestmove_sofar = ""
    for move in moves
        copied = makeMoveUCI(move,board,colour)
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
    #check for checkmate, -> return -100000000 stalemate -> return 0
    end
    return alpha
end

