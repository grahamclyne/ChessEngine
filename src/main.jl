include("moves.jl")
include("magic.jl")
include("game.jl")
include("search.jl")


board = startPositions()
colour = 'W'

play(board,colour,[])
# position = Dict("board"=>board, "weight"=> 0, "move"=> "", "children"=>[])
# pos = Dict("board"=>board,"children"=>[],"move"=>"")
# @time buildTree(board,colour,3,[])