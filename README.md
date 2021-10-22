Chess Engine

Uses magic bitboards for sliding moves - https://www.chessprogramming.org/Magic_Bitboards
Uses minimax with alpha beta pruning for search - currently can search to depth 4 in a few seconds
Uses UCI to interface with other chess engines - https://en.wikipedia.org/wiki/Universal_Chess_Interface


To run: 

need to add current path to C:\Users\Graham Clyne\.julia\config\startup.jl (in linux, it is ) and push it to LOAD_PATH for modules to work
cd /home/graham/code/ChessEngine/src
export JULIA_LOAD_PATH="`pwd`:$JULIA_LOAD_PATH"
cd /home/graham/code/ChessEngine
julia --project=.
import Pkg
Pkg.add("PProf")
Pkg.add("Traceur")
Pkg.add("BenchmarkTools")
Pkg.add("Profile")
julia ChessEngine.jl

for flame graph:
julia
using PProf
using Search
using Util
board = Util.startPositions()
colour = 'W'
@pprof Search.negamax(-Inf,Inf,4,colour,[],board,0)
go to http://localhost:57599



Old TS instructions:

npm install --global pkg

To run:
Etiher use UCI and create and executable
or
tsc && node dist\main.js

To test:

    tsc && npx jest moves.test.ts

to make exe:
pkg dist\uci.js

