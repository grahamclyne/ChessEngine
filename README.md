bitv library -> https://www.lri.fr/~filliatr/ftp/ocaml/ds/bitv.mli.html


So how do we decide how to map each chess board square to a bit in the 64-bit integer? This mapping could be arbitrary, but it behooves us to pick a mathematically advantageous mapping. In this particular mapping (or winding) we are going to say that position a1 is the least signficant bit (LSB), bit 0, of the 64 bit number and h8 is the most significant bit (MSB), bit 63. The squares will be assigned in a left to right, bottom to top ordering to each bit index in the 64 bit number from LSB to MSB.
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


"c:\Users\Graham Clyne\Documents\chessEngine\node_modules\.bin\tsc.cmd" && node dist\main.js


we use jest because mohca/chai does not have support for bigint
javascript/typescript - Objects and arrays are passed by reference. Primitive values like number, string, boolean are passed by value. A reference to an object is also a primitive type and passed by value like other primitive types, but the object it refers to is still passed by reference.

global variable CHECK_FLAG in game.ts a good idea?
how can history and board state be coupled that neither can be out of sync?