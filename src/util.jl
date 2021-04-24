module Util


mostSignificantBit(n) = UInt64(8 * sizeof(n) - leading_zeros(n)) 
RANK_MASKS = [255,65280,16711680,4278190080,1095216660480,280375465082880,71776119061217280,18374686479671623680]
FILE_MASKS = [72340172838076673,144680345676153346,289360691352306692,578721382704613384,1157442765409226768,2314885530818453536,4629771061636907072,9259542123273814144]


function leastSignificantBit(n)
    if(n == 0)
        return 0
    end
    return UInt64(log2(n & (-n)))
end


function getBit(N, m)
    return (N >> (m - 1)) & 1
end


global letter_to_num = Dict('a'=>1,'b'=>2,'c'=>3,'d'=>4,'e'=>5,'f'=>6,'g'=>7,'h'=>8)
function UCIToBB(move)
    start_index = letter_to_num[move[1]] + ((parse(Int,move[2]) - 1) * 8)
    end_index = letter_to_num[move[3]] + ((parse(Int,move[4]) - 1) * 8)
    return UInt64(start_index),UInt64(end_index)
end


function setBitRange(num, start_index,end_index)
    n = UInt64(num)
    for i in start_index:end_index
        n = n | (1 << (i - 1))
    end
    return n
end


function setBit(N,index,value)
    N = UInt64(N)
    if(value == 1)
    return  N | (1 << (index - 1))
    else
    return N & ~(1 << (index - 1))
    end
end


global  m = Dict(1=>'a',2=>'b',3=>'c',4=>'d',5=>'e',6=>'f',7=>'g',8=>'h')
function BBToUCI(start_index, end_index)
    start_file = (start_index % 8 == 0) ? 8 : start_index % 8
    end_file = (end_index % 8 == 0) ? 8 : end_index % 8 
    start_file = m[start_file]
    start_rank = ceil(UInt64,start_index / 8)
    end_file = m[end_file] 
    end_rank = ceil(UInt64,end_index / 8)
    return start_file * string(start_rank) * end_file * string(end_rank) 
end


function printBB(board)
    for i in 1:64
        if((i-1) % 8 === 0 && i > 1)
            print(' ', i-1 ,  '\n')
        end
        print(getBit(board,i))
    end
    print('\n')
end


function prettyPrintBoard(board::Dict)
    #piece_map = Dict("BP"=>"♙", "BN"=>"♘", "BB"=>"♗", "BR"=>"♖", "BQ"=>"♕", "BK"=>"♔", "WP"=>"♟︎", "WN"=>"♞", "WB"=>"♝", "WR"=>"♜", "WQ"=>"♛", "WK"=>"♚")
    output = Array{String}(undef,64)
    files = [1,2,3,4,5,6,7,8]
    ranks = ["A  ", "B  ", "C  ", "D  ", "E  ", "F  ", "G  ", "H  \n"]
    for index in 1:64
        output[index] = "-- "
    end
    file_count = 0
    for key in keys(board)
        bit_board = Int128(board[key])
        m = digits(bit_board,base=2,pad=64)
        for i in 1:64
            if(m[i] === 1)
                if(key[1] === 'W')
                    output[i] = "\x1b[93m" * key * "\x1b[39m "
                else
                    output[i] = "\x1b[91m" * key * "\x1b[39m "
                end
            end
        end
    end
    for i in ranks
        print(i)
    end
    for i in 1:64

        print(output[i])

        if(i % 8 === 0 && i !== 0)
            print(files[ceil(UInt64,i / 8)], '\n')

        end
    end
end


function emptyPositions()
    board = Dict()
    board["WP"] = 0
    board["WR"] = 0
    board["WN"] = 0
    board["WB"] = 0
    board["WQ"] = 0
    board["WK"] = 0
    board["BP"] = 0
    board["BB"] = 0
    board["BN"] = 0
    board["BR"] = 0
    board["BQ"] = 0
    board["BK"] = 0
    return board
end


function getWhitePieces(board)
    return board["WP"] | board["WB"] | board["WN"] | board["WR"] | board["WQ"] | board["WK"]
end


function getBlackPieces(board)
    return board["BP"] | board["BB"] | board["BN"] | board["BR"] | board["BQ"] | board["BK"]
end


function startPositions()
    board = Dict()
    board["WP"] = setBitRange(0,9,16)
    board["WR"] = setBit(0,1,1) | setBit(0,8,1)
    board["WN"] = setBit(0,2,1) | setBit(0,7,1)
    board["WB"] = setBit(0,3,1) | setBit(0,6,1)
    board["WQ"] = setBit(0,5,1)
    board["WK"] = setBit(0,4,1)
    board["BP"] = setBitRange(0,49,56)
    board["BB"] = setBit(0,62,1) | setBit(0,59,1)
    board["BN"] = setBit(0,63,1) | setBit(0,58,1)
    board["BR"] = setBit(0,64,1) | setBit(0,57,1)
    board["BQ"] = setBit(0,61,1)
    board["BK"] = setBit(0,60,1)
    return board
end


function randomPosition()
    board = startPositions()
    local count = 0
    colour = 'W'
    while(count < 20)
        colour = (colour == 'W') ? 'B' : 'W'
        moves = getMovesFast(board,colour,[])
        move = moves[rand(1:length(moves))]
        board = makeMoveUCI(move,board,colour)
        count = count + 1
    end
    return board
end

function popBit(board,sq)
    return board &= ~(1 << sq)
end

end