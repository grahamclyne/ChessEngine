include("moves.jl")
include("magic.jl")
include("game.jl")
bishop_attacks = Array{Array{Int64}}(undef,64)
rook_attacks = Array{Array{Int64}}(undef,64)

for i in 1:64
    bishop_attacks[i] = Array{Int64}(undef,4096)
    rook_attacks[i] = Array{Int64}(undef,4096)
end


board = startPositions()
colour = 'W'
# println(getMovesUCI(board,colour,[]))
# opp_colour = (colour == 'W') ? 'B' : 'W'
pieces =  board[colour * 'P'] | board[colour * 'N'] | board[colour * 'B'] | board[colour * 'R'] | board[colour * 'Q'] | board[colour * 'K']
occ = @time reduce((x,y) -> x | y, values(board))

x = getPieceMoves(board[colour * 'Q'],occ,pieces,queenMoves,'Q')
println(x)
play(board,colour,[])