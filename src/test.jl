using Test
include("util.jl")
include("magic.jl")
include("moves.jl")

@testset "moves" verbose=true begin
    @test rookMoves(0,1) == parse(UInt64,
    "00000001"*
    "00000001"*
    "00000001"*
    "00000001"*
    "00000001"*
    "00000001"*
    "00000001"*
    "11111110",base=2)

    @test rookMoves(0,64) == parse(UInt64,
    "01111111"*
    "10000000"*
    "10000000"*
    "10000000"*
    "10000000"*
    "10000000"*
    "10000000"*
    "10000000",base=2)

    @test bishopMoves(0,1) == parse(UInt64,
    "10000000"*
    "01000000"*
    "00100000"*
    "00010000"*
    "00001000"*
    "00000100"*
    "00000010"*
    "00000000",base=2)

    @test bishopMoves(0,64) == parse(UInt64,
    "00000000"*
    "01000000"*
    "00100000"*
    "00010000"*
    "00001000"*
    "00000100"*
    "00000010"*
    "00000001",base=2)

    @test queenMoves(0,32) == parse(UInt64,
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
    board = startPositions()
    @test isCheck(board,'B') == false

    board = emptyPositions()
    board["BP"] = setBit(board["BP"], 11,1)
    board["WK"] = setBit(board["WK"],4,1)
    @test isCheck(board,'W') == true

    board = emptyPositions()
    board["WN"] = setBit(board["WN"], 52,1)
    board["BK"] = setBit(board["BK"],37,1)
    @test isCheck(board,'B') == true   
    
    board = emptyPositions()
    board["BQ"] = setBit(board["BQ"], 14,1)
    board["WK"] = setBit(board["WK"],8,1)
    @test isCheck(board,'B') == false
    
    board = emptyPositions()
    board["BQ"] = setBit(board["BQ"], 1,1)
    board["WK"] = setBit(board["WK"],5,1)
    board["BR"] = setBit(board["BR"], 9,1)
    @test isCheckMate(board,'W',[]) == 1
    
    #white in checkmate surrounded by white pieces
    board = emptyPositions()
    board["WP"] = setBit(board["WP"],13,1)
    board["WP"] = setBit(board["WP"],12,1)
    board["WB"] = setBit(board["WB"],6,1)
    board["WQ"] = setBit(board["WQ"],4,1)
    board["WK"] = setBit(board["WK"],5,1)
    board["BQ"] = setBit(board["BQ"],32,1)
    @test isCheckMate(board,'W',[]) == 1

    #white in check, king could take a piece, that piece protected
    board = emptyPositions()
    board["WP"] = setBit(board["WP"],14,1)
    board["BR"] = setBit(board["BR"],13,1)
    board["BB"] = setBit(board["BB"],29,1)
    board["BQ"] = setBit(board["BQ"],4,1)
    board["WK"] = setBit(board["WK"],6,1)
    @test isCheckMate(board,'W',[]) == 1
    
    #white in check but piece can intervene
    board = emptyPositions()
    board["WP"] = setBit(board["WP"],14,1)
    board["WR"] = setBit(board["WR"],13,1)
    board["BB"] = setBit(board["BB"],29,1)
    board["BQ"] = setBit(board["BQ"],4,1)
    board["WK"] = setBit(board["WK"],6,1)
    @test isCheckMate(board,'W',[]) == 0
    @test isCheck(board,'W') == true
    
    #stalemate
    board = emptyPositions()
    board["WP"] = setBit(board["WP"],50,1)
    board["WQ"] = setBit(board["WR"],42,1)
    board["BK"] = setBit(board["BB"],58,1)
    @test isCheckMate(board,'B',[]) == 2
    @test isCheck(board,'B') == false
       
    #capture out of check 
    board = emptyPositions()
    board["BQ"] = setBit(board["BQ"],60,1)
    board["WQ"] = setBit(board["WQ"],59,1)
    board["BK"] = setBit(board["BK"],61,1)
    @test isCheck(board,'B') == false    
end

@testset "pawn promotion" verbose = true begin

    #pawn promotion forward to queen 
    board = emptyPositions()
    board["WP"] = setBit(board["WP"],56,1)
    board = makeMoveUCI("h7h8Q",board,'W')
    @test board["WQ"] > 0
    @test board["WP"] == 0 

    #pawn promotion forward to queen 
    board = emptyPositions()
    board["BP"] = setBit(board["BP"],9,1)
    @test "a2a1Q" in getMovesUCI(board,'B',[])
end

@testset "en passant" verbose = true begin

    #simple en passant of white pawn
    history = []
    board = emptyPositions()
    board["WP"] = setBit(board["WP"],37,1)
    board["BP"] = setBit(board["BP"],38,1)
    push!(history,"e3e5")
    moves = getMovesUCI(board,'B',history)
    @test "f5e4" in moves

    # #not en passant of black pawn
    # history = []
    # board = emptyPositions()
    # board["WP"] = setBit(board["WP"],37,1)
    # board["BP"] = setBit(board["BP"],38,1)
    # push!(history,"e3e5")
    # moves = getMovesUCI(board,'B',history)
    # @test "" not in moves
end

@testset "castling" verbose = true begin
    #simple en passant of white pawn
    history = []

    #black castling king side
    board = emptyPositions()
    board["BR"] = setBit(board["BR"],64,1)
    board["BK"] = setBit(board["BK"],61,1)
    occ = reduce((x,y) -> x | y, values(board))
    @test "e8g8" in castleMoves(board,'B',history,occ)

    #white castle queenside
    board = emptyPositions()
    board["WR"] = setBit(board["WR"],1,1)
    board["WK"] = setBit(board["WK"],5,1)
    occ = reduce((x,y) -> x | y, values(board))
    @test "e1c1" in castleMoves(board,'W',history,occ)
   
    #rook already moved
    board = emptyPositions()
    board["WR"] = setBit(board["WR"],1,1)
    board["WK"] = setBit(board["WK"],5,1)
    occ = reduce((x,y) -> x | y, values(board))
    history = ["a3a1"]
    @test length(castleMoves(board,'W',history,occ)) == 0

    #king already moved
    board = emptyPositions()
    board["WR"] = setBit(board["WR"],1,1)
    board["WK"] = setBit(board["WK"],5,1)
    occ = reduce((x,y) -> x | y, values(board))
    history = ["e2e1"]
    @test length(castleMoves(board,'W',history,occ)) == 0

    #piece in the way 
    board = emptyPositions()
    board["WR"] = setBit(board["WR"],1,1)
    board["WK"] = setBit(board["WK"],5,1)
    board["WB"] = setBit(board["WB"],3,1)
    occ = reduce((x,y) -> x | y, values(board))
    history = []
    @test length(castleMoves(board,'W',history,occ)) == 0

    #castle through a check 
    board = emptyPositions()
    board["BR"] = setBit(board["BR"],60,1)
    board["BK"] = setBit(board["BK"],64,1)
    board["WQ"] = setBit(board["WQ"],9,1)
    occ = reduce((x,y) -> x | y, values(board))
    history = []
    @test length(castleMoves(board,'B',history,occ)) == 0
end

@testset "search" verbose = true begin
end

@testset "eval" verbose = true begin
end

@testset "util" verbose = true begin
    #least sig bit
    @test leastSignificantBit(1130822006734848) == 10
    @test 18  == leastSignificantBit(1130822006472704)

end
