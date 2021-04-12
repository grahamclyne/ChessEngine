include("moves.jl")

function isCheck(colour,board)
    king = board[colour * 'K']
    opp_colour = (colour == 'W') ? 'B' : 'W'
    attack = getAttackBoard(opp_colour,board,true)
    return ((king & attack) > 0) ? true : false
    return false
end

function isCheckMate(board,colour,history)
    check = isCheck(colour,board)
    legal_moves = getMovesUCI(board,colour,history)
    while(check && length(legal_moves) > 0)
        rand = floor(rand() * length(legal_moves))
        move = legal_moves[rand]
        board_state = makeMoveUCI(move,board,colour)
        if(!isCheck(colour,board_state))
            check = false
        else
            legal_moves = filter(x -> (if(x != move) return x end), legal_moves)
        end
    end
    if(length(legal_moves) == 0 && check)
        return 1
    else if (length(legal_moves) == 0 && ~check) #stalemate
        return 2
    else
        return 0
    end
end
