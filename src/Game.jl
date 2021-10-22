module Game

import Util
import Moves
import Search

function pickMoveUCI(board,colour,history)
    Search.search(3,colour,history,board)
    return Search.best_move
end


function play(board,colour,history)
    states = []
    while(true)
        opp_colour = (colour === 'W') ? 'B' : 'W'
        board,states = @time takeTurn(board,history,colour,states)
        colour = opp_colour
        if(checkEndGame(board,states,history,colour)) break end
    end

end

function takeTurn(board,history,colour,states)
    move = pickMoveUCI(board,colour,history)
    push!(history,move)
    println("move picked: ", move)
    board = Moves.makeMoveUCI(move,board,colour)
    state = reduce((x,y) -> x | y, values(board))
    push!(states,state)
    Util.prettyPrintBoard(board)
    return board,states
end


# //=============================  END GAME LOGIC  =============================//
# //============================================================================//

function checkEndGame(board,states,history,colour)
    opp_colour = (colour ==='W') ? 'B' : 'W'
    if (checkForMate(board,colour,history) === 1 || checkForMate(board,colour,history) === 2 || 
        sameBoardStateFiveTimes(states) || fiftyMoves(history) || ~(hasEnoughMaterial(board,colour) || hasEnoughMaterial(board,opp_colour)))
        println("GAME OVER")
        print(board)
        return true
    end
    return false
end


function checkForMate(board,colour,history)
    check_mate = Moves.isCheckMate(board,colour,history)
    if(check_mate == true)
        println("checkmate")
    end
    return check_mate
end


function sameBoardStateFiveTimes(states)
    groups = Dict()
    for i in states
        if i in keys(groups)
            groups[i] = groups[i] + 1
            if(groups[i] > 5)
                println("same state five times")
                return true
            end
        else
            groups[i] = 1
        end
    end
    return false
end


# The fifty-move rule in chess states that a player can claim a draw if no capture has been made and no pawn has been moved in the last fifty moves 
# (for this purpose a "move" consists of a player completing their turn followed by the opponent completing their turn)
function fiftyMoves(history)
    if(length(history) < 50)
        return false
    end
    fifty = history[length(history)-49:length(history)]
    pawn_moves = [] #how to get pawn moves from UCI notated? 
    if(length(pawn_moves) > 0)
        return false
    end
    captures = ['l'] #how to get caps
    if(length(captures) > 0)
        return false
    end
    print("fifty moves")
    return true
end



function hasEnoughMaterial(board,colour)
    if(board[colour * 'P'] > 0 || (board[colour * 'N'] > 0 && board[colour * 'B'] > 0) || board[colour * 'R'] > 0 
        || board[colour * 'Q'] > 0  || count_ones(board[colour * 'B']) === 2)
        return true
    end
    print("not enough material")
    return false
end

end