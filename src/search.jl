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

struct Node
    id::Int
    parent::Int
    children::Array
    alpha::Int
    beta::Int
    move::String
    board::Dict
end

function printNode(node)
    println(string(node.id) * ' ' * node.move)
end

function printTree(tree,tabs)
    for child in tree.children
        for i in 1:tabs
            print('\t')
        end
        printNode(child)
        if(child.children !== [])
            
            printTree(child,tabs+1)
        end
    end
end


function buildTree(node,colour,depth)
    opp_colour = (colour === 'W') ? 'B' : 'W'
    is_check = isCheck(board,colour)
    moves = getMovesUCI(board,colour,[],is_check)
    if(depth === 0)
        return node
    end
    id = node.id
    for move in moves
        id = id + 1
        temp_board = makeMoveUCI(move,board,colour)
        child = Node(id,node.id,[],0,0,move,board)
        child = buildTree(child,opp_colour,depth-1)
        push!(node.children,child)
    end
    return node
end


function minimax(position, depth,colour,alpha,beta,history)
    is_check = isCheck(position["board"],colour)
    moves = getMovesUCI(position["board"],colour,history,is_check)
    opp_colour = (colour === 'W') ? 'B' : 'W'
    compare_func = (colour === 'W') ? max : min;
    evaluation = (colour === 'W') ? -Inf : Inf;
    if(depth == 0)
        weight = staticEvaluation(position["board"],length(moves))
        return Dict("board"=>position["board"],"weight"=>weight,"move"=>position["move"],"children"=>position["children"])
    end
    for move in moves
        child = Dict("board"=>makeMoveUCI(move,position["board"],colour),"weight"=>0,"move"=>move,"children"=>[])
        w = minimax(child,depth-1,opp_colour,alpha,beta,history)
        if(colour === 'W')
            evaluation = compare_func(w["weight"],evaluation)
            alpha = compare_func(alpha,w["weight"])
        else
            evaluation = compare_func(w["weight"],evaluation)
            beta = compare_func(beta,w["weight"])
        end
        if(beta <= alpha)
            break
        end
        push!(position["children"],w)
    end
    return Dict("board"=>position["board"],"weight"=>evaluation, "move"=>position["move"],"children"=>position["children"])
end
    