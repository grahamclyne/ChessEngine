using Profile
using PProf
using Traceur
using BenchmarkTools

import Moves
import Util
import Game
import Search
board = Util.startPositions()
colour = 'W'
# Game.play(board,colour,[])

Search.negamax(-Inf,Inf,4,colour,[],board,0)
@btime Search.negamax(-Inf,Inf,4,colour,[],board,0)

@profile Search.negamax(-Inf,Inf,4,colour,[],board,0)
pprof()