Chess Engine

Uses magic bitboards for sliding moves - https://www.chessprogramming.org/Magic_Bitboards
Uses minimax with alpha beta pruning for search - currently can search to depth 4 in a few seconds
Uses UCI to interface with other chess engines - https://en.wikipedia.org/wiki/Universal_Chess_Interface

mapping to bitboard: 
A8 	B8 	C8 	D8 	E8 	F8 	G8 	H8
A7 	B7 	C7 	D7 	E7 	F7 	G7 	H7
A6 	B6 	C6 	D6 	E6 	F6 	G6 	H6
A5 	B5 	C5 	D5 	E5 	F5 	G5 	H5
A4 	B4 	C4 	D4 	E4 	F4 	G4 	H4
A3 	B3 	C3 	D3 	E3 	F3 	G3 	H3
A2 	B2 	C2 	D2 	E2 	F2 	G2 	H2
A1 	B1 	C1 	D1 	E1 	F1 	G1 	H1
	
56 	57 	58 	59 	60 	61 	62 	63
48 	49 	50 	51 	52 	53 	54 	55
40 	41 	42 	43 	44 	45 	46 	47
32 	33 	34 	35 	36 	37 	38 	39
24 	25 	26 	27 	28 	29 	30 	31
16 	17 	18 	19 	20 	21 	22 	23
8 	9 	10 	11 	12 	13 	14 	15
0 	1 	2 	3 	4 	5 	6 	7

npm install --global pkg



To run:

Etiher use UCI and create and executable

or

tsc && node dist\main.js

To test:

    tsc && npx jest moves.test.ts


to make exe:

pkg dist\uci.js




d everything under the L20 label. The actual indexing is just the movq and movsd instructions. So if you care about really fast code then you will get much more of a performance penalty from the bound checking than the 1-based indexing. Fortunately Julia offers ways to alleviate this problems through the use of @inbound and --check-bounds=no.


THE sq variable, and whenever looking to access a square from the board is not zero indexed, 64 is possible, 0 is not etc

need to add current path to C:\Users\Graham Clyne\.julia\config\startup.jl and push it to LOAD_PATH for modules to work

using Revise in REPL so do not have to restart module to reuse pprof when changing a function does not work --- so slow