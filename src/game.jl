include("util.jl")


# =============================  GAME MECHANICS  =============================
# ============================================================================
# all modifications to board live here


function pickMoveUCI(board,colour,history,is_check)
    w = negamax(-Inf,Inf,3,colour,history,board,0)
    println("weight of move: ", w, ' ', best_move)
    return best_move
end



function makeMoveUCI(move,board,colour)
    output = copy(board)
    start_index, end_index = UCIToBB(move)
    for (key,value) in board
        is_capture = false
        for key_2 in keys(board)
            if(key === key_2)
                continue
            end
            bit_board = board[key_2]
            if(bit_board & (1 << (end_index - 1)) > 0)
                output[key_2] = setBit(board[key_2],end_index,0)
                is_capture = true
                break
            end
        end

        if (getBit(value,start_index) == 1)
            #if en passant
            if ('P' in key && ~is_capture && abs(end_index - start_index) != 8 && abs(end_index - start_index) != 16)
                if(colour === 'W')
                     output["BP"] = setBit(board["BP"], end_index - 8, 0)
                else
                     output["WP"] = setBit(board["WP"], end_index + 8,0)
                end
            #if castle
            elseif ('K' in key)
                if (move === "e1g1")
                     output["WR"] = setBit(board["WR"],8,0)
                     output["WR"] = setBit(output["WR"],6,1)
                elseif (move === "e1c1")
                    output["WR"] = setBit(board["WR"],1,0)
                    output["WR"] = setBit(output["WR"],4,1)
                elseif (move === "e8g8")
                    output["BR"] = setBit(board["BR"],64,0)
                    output["BR"] = setBit(output["BR"],62,1)
                elseif (move === "e8c8")
                    output["BR"] = setBit(board["BR"],57,0)
                    output["BR"] = setBit(output["BR"],60,1)
                end
            end
            output[key] = setBit(output[key],start_index,0)
            output[key] = setBit(output[key],end_index,1)
        end
   
    end
    if(length(move) === 5) #pawn promotion
        output[colour * 'P'] = setBit(board[colour * 'P'], start_index,0)
        output[colour * move[5]] = setBit(board[colour * move[5]],end_index,1)
        return output
    end
    return output
end




function play(board,colour,history)
    states = []
    while(true)
        opp_colour = (colour === 'W') ? 'B' : 'W'
        is_check = isCheck(board,colour)
        board,states = @time takeTurn(board,history,colour,states,is_check)
        colour = opp_colour
        if(checkEndGame(board,states,history,colour)) break end
    end

end

function takeTurn(board,history,colour,states,is_check)
    move = pickMoveUCI(board,colour,history,is_check)
    push!(history,move)
    println("move picked: ", move)
    board = makeMoveUCI(move,board,colour)
    state = reduce((x,y) -> x | y, values(board))
    push!(states,state)
    prettyPrintBoard(board)
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
    check_mate = isCheckMate(board,colour,history)
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