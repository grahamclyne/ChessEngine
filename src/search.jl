include("moves.jl")

function staticEvaluation(board,mobility)
    score = count_ones(board["WP"]) - count_ones(board["BP"])
    score = score + (3 * (count_ones(board["WN"])) + count_ones(board["WB"]) - (count_ones(board["BN"]) + count_ones(board["BB"])))
    score = score + (5 * (count_ones(board["WR"]) - count_ones(board["BR"])))
    score = score + (9 * (count_ones(board["WQ"]) - count_ones(board["BQ"])))
    score = score + (200 * (count_ones(board["WK"]) - count_ones(board["BK"])))
    score = score + (0.1 * mobility)
    return score
end

function buildTree(board,colour,depth,path)
    println(path)
    opp_colour = (colour == 'W') ? 'B' : 'W'
    is_check = isCheck(board,colour)
    moves = @time getMovesUCI(board,colour,[],is_check)
    if(depth <= 0)
        println("DONE")
        return 
    end
    for move in moves
        temp_board = makeMoveUCI(move,pos["board"],colour)
        m = copy(path)
        push!(m,move)
        buildTree(temp_board,opp_colour,depth-1,m) 
    end
    
end