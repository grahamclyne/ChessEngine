leastSignificantBit(n) = trailing_zeros(n) + 1
mostSignificantBit(n) = 8 * sizeof(n) - leading_zeros(n) 
RANK_MASKS = [255,65280,16711680,4278190080,1095216660480,280375465082880,71776119061217280,18374686479671623680]
FILE_MASKS = [72340172838076673,144680345676153346,289360691352306692,578721382704613384,1157442765409226768,2314885530818453536,4629771061636907072,9259542123273814144]


function getBit(N, m)
    return digits(N,base=2,pad=64)[m] 
end

function UCIToBB(move)
    letter_to_num = Dict('a'=>1,'b'=>2,'c'=>3,'d'=>4,'e'=>5,'f'=>6,'g'=>7,'h'=>8)
    start_index = letter_to_num[move[1]] + ((parse(Int,move[2]) - 1) * 8)
    end_index = letter_to_num[move[3]] + ((parse(Int,move[4]) - 1) * 8)
    return start_index,end_index
end

function setBitRange(num, start_index,end_index)
    n = digits(num,base=2,pad=64)
    for i in start_index:end_index
        n[i] = 1
    end
    n = reverse(n)
    n = join(n)
    return parse(UInt64,n,base=2)
end

function setBit(num,index,value)
    n = digits(num,base=2,pad=64)
    n[index] = value
    return parse(UInt64,join(reverse(n)),base=2)
end
function BBToUCI(start_index, end_index)
    # println(start_index, ' ', end_index )
    m = Dict(1=>'a',2=>'b',3=>'c',4=>'d',5=>'e',6=>'f',7=>'g',8=>'h')
    start_file = (start_index % 8 == 0) ? 8 : start_index % 8
    end_file = (end_index % 8 == 0) ? 8 : end_index % 8 
    start_file = m[start_file]
    start_rank = ceil(Int64,start_index / 8)
    end_file = m[end_file] 
    end_rank = ceil(Int64,end_index / 8)
    return start_file * string(start_rank) * end_file * string(end_rank) 
end



function printBB(board)
    for i in 1:64
        if((i-1) % 8 == 0 && i > 1)
            print(' ', i-1 ,  '\n')
        end
        print(getBit(board,i))
    end
    print('\n')
end



function prettyPrintBoard(board::Dict)
    #piece_map = Dict("BP"=>"♙", "BN"=>"♘", "BB"=>"♗", "BR"=>"♖", "BQ"=>"♕", "BK"=>"♔", "WP"=>"♟︎", "WN"=>"♞", "WB"=>"♝", "WR"=>"♜", "WQ"=>"♛", "WK"=>"♚")
    output = Array{String}(undef,64)
    files = [8,7,6,5,4,3,2,1]
    ranks = ["A  ", "B  ", "C  ", "D  ", "E  ", "F  ", "G  ", "H  \n"]
    for index in 1:64
        output[index] = "-- "
    end
    file_count = 0
    for key in keys(board)
        bit_board = board[key]
        m = digits(bit_board,base=2,pad=64)
        for i in 1:64
            if(m[i] == 1)
                if(key[1] == 'W')
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

        if(i % 8 == 0 && i != 0)
            print(files[ceil(Int64,i / 8)], '\n')

        end
    end
    

end


function startPositions()
    board = Dict()
    board["WP"] = setBitRange(0,9,16)
    board["WR"] = setBitRange(0,1,1) | setBitRange(0,8,8)
    board["WN"] = setBitRange(0,2,2) | setBitRange(0,7,7)
    board["WB"] = setBitRange(0,3,3) | setBitRange(0,6,6)
    board["WQ"] = setBitRange(0,5,5)
    board["WK"] = setBitRange(0,4,4)
    board["BP"] = setBitRange(0,49,56)
    board["BB"] = setBitRange(0,62,62) | setBitRange(0,59,59)
    board["BN"] = setBitRange(0,63,63) | setBitRange(0,58,58)
    board["BR"] = setBitRange(0,64,64) | setBitRange(0,57,57)
    board["BQ"] = setBitRange(0,61,61)
    board["BK"] = setBitRange(0,60,60)
    return board
end
