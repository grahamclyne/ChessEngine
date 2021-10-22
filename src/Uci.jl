module Uci

import Util

DEBUG_MODE = false
function boot()
    Moves.initSlidersAttack(true)
    Moves.initSlidersAttack(false)
    board = Util.startPositions()
    while(true)
        s = readline(stdin)
        if("uci" in s)
            id()
            option()
            uciok()
        elseif ("debug" in s)
            DEBUG_MODE = (DEBUG_MODE == true) ? false : true
        elseif ("isready" in s)
            println("readyok")
        elseif ("setoption name" in s)
            continue
        elseif ("register" in s)
            continue
        elseif ("ucinewgame" in s)
            continue
        elseif ("position" in s)
            input = split(s," ")
            if(input[2] == "startpos")
                board = Util.startPositions()
            end
            let colour = 'W'
            for index in 4:length(input)
                move = input[index]
                board = makeMoveUCI(move,board,colour)
                colour = (colour == 'W') ? 'B' : 'W'
            end
        elseif ("go" in s)
            move = pickMoveUCI(board,[],'B')
            println("bestmove ", move)
            board = makeMoveUCI(move,board,'B')
        elseif ("stop" in s)
        elseif ("ponderhit" in s)
        elseif ("quit" in s)

        end

end


function id()
    println("id name Europa")
    println("id name Kubrick")
end

function uciok()
    println("uciok")
end

function readyok()
    println("readyok")
end

function bestmove()
end

function copyprotection()
end

function registration()
end

function info()
end

function option()
end

boot()

end
