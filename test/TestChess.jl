module TestChess

using Test
import Moves
import Util
import Magic

@testset "moves" verbose=true begin
    @test Moves.rookMoves(0,1) == parse(UInt64,
    "00000001"*
    "00000001"*
    "00000001"*
    "00000001"*
    "00000001"*
    "00000001"*
    "00000001"*
    "11111110",base=2)

    @test Moves.rookMoves(0,64) == parse(UInt64,
    "01111111"*
    "10000000"*
    "10000000"*
    "10000000"*
    "10000000"*
    "10000000"*
    "10000000"*
    "10000000",base=2)

    @test Moves.bishopMoves(0,1) == parse(UInt64,
    "10000000"*
    "01000000"*
    "00100000"*
    "00010000"*
    "00001000"*
    "00000100"*
    "00000010"*
    "00000000",base=2)

    @test Moves.bishopMoves(0,64) == parse(UInt64,
    "00000000"*
    "01000000"*
    "00100000"*
    "00010000"*
    "00001000"*
    "00000100"*
    "00000010"*
    "00000001",base=2)

    @test Moves.queenMoves(0,32) == parse(UInt64,
    "10001000"*
    "10010000"*
    "10100000"*
    "11000000"*
    "01111111"*
    "11000000"*
    "10100000"*
    "10010000",base=2)
end

@testset "check " verbose = true begin
    board = Util.startPositions()
    @test Moves.isCheck(board,'B') == false

    board = Util.emptyPositions()
    board["BP"] = Util.setBit(board["BP"], 11,1)
    board["WK"] = Util.setBit(board["WK"],4,1)
    @test Moves.isCheck(board,'W') == true

    board = Util.emptyPositions()
    board["WN"] = Util.setBit(board["WN"], 52,1)
    board["BK"] = Util.setBit(board["BK"],37,1)
    @test Moves.isCheck(board,'B') == true   
    
    board = Util.emptyPositions()
    board["BQ"] = Util.setBit(board["BQ"], 14,1)
    board["WK"] = Util.setBit(board["WK"],8,1)
    @test Moves.isCheck(board,'B') == false
    
    board = Util.emptyPositions()
    board["BQ"] = Util.setBit(board["BQ"], 1,1)
    board["WK"] = Util.setBit(board["WK"],5,1)
    board["BR"] = Util.setBit(board["BR"], 9,1)
    @test Moves.isCheckMate(board,'W',[]) == 1
    
    #white in checkmate surrounded by white pieces
    board = Util.emptyPositions()
    board["WP"] = Util.setBit(board["WP"],13,1)
    board["WP"] = Util.setBit(board["WP"],12,1)
    board["WB"] = Util.setBit(board["WB"],6,1)
    board["WQ"] = Util.setBit(board["WQ"],4,1)
    board["WK"] = Util.setBit(board["WK"],5,1)
    board["BQ"] = Util.setBit(board["BQ"],32,1)
    @test Moves.isCheckMate(board,'W',[]) == 1

    #white in check, king could take a piece, that piece protected
    board = Util.emptyPositions()
    board["WP"] = Util.setBit(board["WP"],14,1)
    board["BR"] = Util.setBit(board["BR"],13,1)
    board["BB"] = Util.setBit(board["BB"],29,1)
    board["BQ"] = Util.setBit(board["BQ"],4,1)
    board["WK"] = Util.setBit(board["WK"],6,1)
    @test Moves.isCheckMate(board,'W',[]) == 1
    
    #white in check but piece can intervene
    board = Util.emptyPositions()
    board["WP"] = Util.setBit(board["WP"],14,1)
    board["WR"] = Util.setBit(board["WR"],13,1)
    board["BB"] = Util.setBit(board["BB"],29,1)
    board["BQ"] = Util.setBit(board["BQ"],4,1)
    board["WK"] = Util.setBit(board["WK"],6,1)
    @test Moves.isCheckMate(board,'W',[]) == 0
    @test Moves.isCheck(board,'W') == true
    
    #stalemate
    board = Util.emptyPositions()
    board["WP"] = Util.setBit(board["WP"],50,1)
    board["WQ"] = Util.setBit(board["WR"],42,1)
    board["BK"] = Util.setBit(board["BB"],58,1)
    @test Moves.isCheckMate(board,'B',[]) == 2
    @test Moves.isCheck(board,'B') == false
       
    #capture out of check 
    board = Util.emptyPositions()
    board["BQ"] = Util.setBit(board["BQ"],60,1)
    board["WQ"] = Util.setBit(board["WQ"],59,1)
    board["BK"] = Util.setBit(board["BK"],61,1)
    @test Moves.isCheck(board,'B') == false    

    #king capture out of checkmate
    board = Util.emptyPositions()
    board["BQ"] = Util.setBit(0,63,1)
    board["BR"] = Util.setBit(0,49,1)
    board["WK"] = Util.setBit(0,64,1)
    @test Moves.isCheck(board,'W') == true
    @test Moves.isCheckMate(board,'W',[]) == 0


    #cannot move into check

    board = Util.emptyPositions()
    board["BK"] = Util.setBit(0,60,1)
    board["WQ"] = Util.setBit(0,46,1)
    board["BP"] = Util.setBit(0,53,1)
    Util.prettyPrintBoard(board)
    @test length(Moves.getMoves(board,'B',[])) == 5
    

    board = Dict("BR" => 0x8100000000000000, "WK" => 0x0000000000000008, "WB" => 0x0000000000000004, "WQ" => 0x0000000004000000, "BQ" => 0x0000000000000020, "BB" => 0x2000100000000000, "BN" => 0x4200000000000000, "BK" => 0x1000000000000000, "WR" => 0x0000000000000001, "WN" => 0x0000000000000002, "BP" => 0x00e7001000000000, "WP" => 0x00000042110c8000)
    @test Moves.isCheckMate(board,'W',[]) == 0

end

@testset "pawn promotion" verbose = true begin

    #pawn promotion forward to queen 
    board = Util.emptyPositions()
    board["WP"] = Util.setBit(board["WP"],56,1)
    board = Moves.makeMoveUCI("h7h8Q",board,'W')
    @test board["WQ"] > 0
    @test board["WP"] == 0 

    #pawn promotion forward to queen 
    board = Util.emptyPositions()
    board["BP"] = Util.setBit(board["BP"],9,1)
    @test "a2a1Q" in Moves.getMoves(board,'B',[])
end

@testset "en passant" verbose = true begin

    #simple en passant of white pawn
    history = []
    board = Util.emptyPositions()
    board["WP"] = Util.setBit(board["WP"],37,1)
    board["BP"] = Util.setBit(board["BP"],38,1)
    push!(history,"e3e5")
    moves = Moves.getMoves(board,'B',history)
    @test "f5e4" in moves

    # #not en passant of black pawn
    # history = []
    # board = emptyPositions()
    # board["WP"] = Util.setBit(board["WP"],37,1)
    # board["BP"] = Util.setBit(board["BP"],38,1)
    # push!(history,"e3e5")
    # moves = getMovesUCI(board,'B',history)
    # @test "" not in moves
end

@testset "castling" verbose = true begin
    #simple en passant of white pawn
    history = []

    #black castling king side
    board = Util.emptyPositions()
    board["BR"] = Util.setBit(board["BR"],64,1)
    board["BK"] = Util.setBit(board["BK"],61,1)
    occ = reduce((x,y) -> x | y, values(board))
    @test "e8g8" in Moves.castleMoves(board,'B',history,occ)

    #white castle queenside
    board = Util.emptyPositions()
    board["WR"] = Util.setBit(board["WR"],1,1)
    board["WK"] = Util.setBit(board["WK"],5,1)
    occ = reduce((x,y) -> x | y, values(board))
    @test "e1c1" in Moves.castleMoves(board,'W',history,occ)
   
    #rook already moved
    board = Util.emptyPositions()
    board["WR"] = Util.setBit(board["WR"],1,1)
    board["WK"] = Util.setBit(board["WK"],5,1)
    occ = reduce((x,y) -> x | y, values(board))
    history = ["a3a1"]
    @test length(Moves.castleMoves(board,'W',history,occ)) == 0

    #king already moved
    board = Util.emptyPositions()
    board["WR"] = Util.setBit(board["WR"],1,1)
    board["WK"] = Util.setBit(board["WK"],5,1)
    occ = reduce((x,y) -> x | y, values(board))
    history = ["e2e1"]
    @test length(Moves.castleMoves(board,'W',history,occ)) == 0

    #piece in the way 
    board = Util.emptyPositions()
    board["WR"] = Util.setBit(board["WR"],1,1)
    board["WK"] = Util.setBit(board["WK"],5,1)
    board["WB"] = Util.setBit(board["WB"],3,1)
    occ = reduce((x,y) -> x | y, values(board))
    history = []
    @test length(Moves.castleMoves(board,'W',history,occ)) == 0

    #castle through a check 
    board = Util.emptyPositions()
    board["BR"] = Util.setBit(board["BR"],60,1)
    board["BK"] = Util.setBit(board["BK"],64,1)
    board["WQ"] = Util.setBit(board["WQ"],9,1)
    occ = reduce((x,y) -> x | y, values(board))
    history = []
    @test length(Moves.castleMoves(board,'B',history,occ)) == 0
end

@testset "search" verbose = true begin
end





@testset "eval" verbose = true begin

    board = Util.emptyPositions()
    board["WR"] = Util.setBit(0,16,1)
    board["BR"] = Util.setBit(0,64,1)
    board["BB"] = Util.setBit(0,9,1)
    @test count_ones(Moves.getAttackBoard(board,'W',false) & Util.getBlackPieces(board)) == 2
    



end



@testset "util" verbose = true begin
    #least sig bit
#    @test 18  == leastSignificantBit(1130822006472704)
#     @test leastSignificantBit(1130822006734848) == 10
 
end


end