import {set,get,setRange} from './bitSetUtils'
import { reduce } from 'lodash'
import * as moves from './moves'



export function getOccupancy(board) {
	return reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
}

export function setRankMasks() {
	let rankMasks = [];
	let rank = 0n;
	let x = 0;
	while (x < 64) {
		if ((x + 1) % 8 == 0 && x != 0) {
			rank = set(rank, x, 1)
			rankMasks.push(rank);
			rank = 0n;
		}
		else {
			rank = set(rank, x, 1)
		}
		x = x + 1;
	}
	return rankMasks;
}

export function setFileMasks() {
	let fileMasks = [];
	let file = 0n;
	let y = 0
	let x = 0
	while (y < 8) {
		x = y
		while (x < 64) {
			file = set(file, x, 1)
			x = x + 8
		}
		fileMasks.push(file);
		file = 0n;
		y = y + 1;
	}
	return fileMasks
}

export function prettyPrintBoard(board) {
	//	let pieceMap = {"BP":"♙", "BN":"♘", "BB":"♗", "BR":"♖", "BQ":"♕", "BK":"♔", "WP":"♟︎", "WN":"♞", "WB":"♝", "WR":"♜", "WQ":"♛", "WK":"♚"}
	let finBoard = Array(64);
	let files = [1, 2, 3, 4, 5, 6, 7, 8]
	let ranks = ['  A  ', 'B  ', 'C  ', 'D  ', 'E  ', 'F  ', 'G  ', 'H  \n']
	finBoard.fill("-- ")
	let fileCount = 0;
	board.forEach((value, key) => {
		let bitSet = BigInt.asUintN(64, BigInt(value))
		let black = bitSet.toString(2).split("").reverse()
		//	let piece = pieceMap[key]
		let piece = key
		black.map((el, index) => {
			if (el == '1') {
				if (key[0] == 'W') {
					finBoard[index] = '\x1b[93m' + piece + '\x1b[39m '
				}
				else {
					finBoard[index] = '\x1b[91m' + piece + '\x1b[39m '
				}
			}
		})

	})
	ranks.map(x => process.stdout.write(x))
	finBoard.map(function (el, index) {
		if ((index % 8) == 0) {
			process.stdout.write(files[fileCount] + ' ')
			fileCount++
		}


		if ((index + 1) % 8 == 0 && index != 0) {
			process.stdout.write(el + "\n")
		}
		else {
			process.stdout.write(el)
		}
	})
}

export function newBoard(...pieces) {
	let board = new Map()
	board.set('WP', 0n)
	board.set('WN', 0n)
	board.set('WB', 0n)
	board.set('WR', 0n)
	board.set('WQ', 0n)
	board.set('WK', 0n)
	board.set('BP', 0n)
	board.set('BN', 0n)
	board.set('BB', 0n)
	board.set('BR', 0n)
	board.set('BQ', 0n)
	board.set('BK', 0n)
	for (var i in pieces) {
		board.set(pieces[i][1], pieces[i][0])
	}
	return board;
}

export function pieceCount(board: Map<string, bigint>): bigint {
	let count = reduce(Array.from(board.values()), (x, y) => (x + count_1s(y)), 0n)
	return count
}

export function count_1s(b: bigint): number {
	let r = 0;
	for (r = 0; b; r++, b &= b - 1n);
	return r;
}



export function arrayEquals(a, b) {
	return Array.isArray(a) &&
		Array.isArray(b) &&
		a.length === b.length &&
		a.every((val, index) => val === b[index]);
}

export function deepCloneMap(map) {
	let out = new Map()
	map.forEach((value, key) => {
		out.set(key, value)
	})
	return out
}

//eg rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
export function parseFEN(fenString: string) {
	let fen = fenString.split(" ")
	let piecePlacement = parseFENPosition(fen[0])
	let colour = fen[1]
	let castling = fen[2]
	let passant = fen[3]
	let halfmove = fen[4]
	let fullmove = fen[5]
	return piecePlacement
}

export function makeFEN(board: Map<string, bigint>, colour, history, halfMove, fullMove) {
	//set board
	let pieceMap = {
		'WP': 'p',
		'WN': 'n',
		'WB': 'b',
		'WR': 'r',
		'WK': 'k',
		'WQ': 'q',
		'BP': 'P',
		'BN': 'N',
		'BB': 'B',
		'BR': 'R',
		'BK': 'K',
		'BQ': 'Q'
	}
	let fenString = ''
	let totalBoard = new Array(64).fill(0)
	board.forEach((value, key) => {
		for (let index = 0; index < 64; index++) {
			if (get(value, index) == 1) {
				totalBoard[index] = pieceMap[key]
			}
		}
	})
	let spaceCount = 0
	totalBoard.forEach((val, index) => {

		if (val == 0) {
			spaceCount++
		}
		else {
			if (spaceCount > 0) {
				fenString = fenString + spaceCount
				spaceCount = 0
			}
			fenString = fenString + val

		}
		if ((index + 1) % 8 == 0 && index > 0 && index < 63) {
			if (spaceCount > 0) {
				fenString = fenString + spaceCount
				spaceCount = 0
			}
			fenString = fenString + '/'
		}
	})

	//set colour
	colour = (colour == 'W') ? 'w' : 'b'
	fenString = fenString + " " + colour

	//set castling
	let castling = ''
	let occ = getOccupancy(board)
	let wq = moves.canCastleQueenSide(occ, history, 'W');
	let wk = moves.canCastleKingSide(occ, history, 'W')
	let bq = moves.canCastleQueenSide(occ, history, 'B')
	let bk = moves.canCastleKingSide(occ, history, 'B')
	if (wk == true) {
		castling = castling + 'K'
	}
	if (wq == true) {
		castling = castling + 'Q'
	}
	if (bk == true) {
		castling = castling + 'k'
	}
	if (bq == true) {
		castling = castling + 'q'
	}
	if (castling == '') {
		castling = '-'
	}
	fenString = fenString + " " + castling
	//set passant
	let fileMap = {
		1: 'a',
		2: 'b',
		3: 'c',
		4: 'd',
		5: 'e',
		6: 'f',
		7: 'g',
		8: 'h'
	}
	let passant = '-'
	let enpassant = (colour == 'W') ? function (a, b) { return a + b } : function (a, b) { return a - b }
	let piecesToMove = board.get(colour + 'P')
	let lastMove = history[history.length - 1]
	if (lastMove != null && (lastMove[2] == 'P') && Math.abs(lastMove[1] - lastMove[0]) == 16) { //if last move was a pawn moving two sqs
		if (get(piecesToMove, lastMove[1] + 1) == 1 || (get(piecesToMove, lastMove[1] - 1) == 1)) { //to the right if white, to the left if black
			let rank = enpassant(lastMove[1], 8) / 8
			let file = fileMap[enpassant(lastMove[1], 8) % 8]
			enpassant = file + rank
		}
	}
	fenString = fenString + " " + passant
	//set halfmove
	fenString = fenString + " " + halfMove
	//set fullmove
	fenString = fenString + " " + fullMove
	return fenString
}

export function parseFENPosition(positions: string) {
	//e.g. rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
	let boardIndex = 0
	let board = newBoard()
	Array.from(positions).forEach((value, index) => {
		if (value.match(/[0-9]/)) {
			boardIndex = boardIndex + parseInt(value)
		}
		else if (value == '/') {
			//skip so boardIndex not incremented
		}
		else {
			switch (value) {
				case 'r':
					board.set('WR', set(board.get('WR'), boardIndex, 1))
					break
				case 'n':
					board.set('WN', set(board.get('WN'), boardIndex, 1))
					break
				case 'b':
					board.set('WB', set(board.get('WB'), boardIndex, 1))
					break
				case 'q':
					board.set('WQ', set(board.get('WQ'), boardIndex, 1))
					break
				case 'k':
					board.set('WK', set(board.get('WK'), boardIndex, 1))
					break
				case 'p':
					board.set('WP', set(board.get('WP'), boardIndex, 1))
					break
				case 'R':
					board.set('BR', set(board.get('BR'), boardIndex, 1))
					break
				case 'N':
					board.set('BN', set(board.get('BN'), boardIndex, 1))
					break
				case 'B':
					board.set('BB', set(board.get('BB'), boardIndex, 1))
					break
				case 'Q':
					board.set('BQ', set(board.get('BQ'), boardIndex, 1))
					break
				case 'K':
					board.set('BK', set(board.get('BK'), boardIndex, 1))
					break
				case 'P':
					board.set('BP', set(board.get('BP'), boardIndex, 1))
					break
				default:
					break

			}
			boardIndex++
		}

	})
	return board
}


export const rankMasks: bigint[] = setRankMasks();
export const fileMasks: bigint[] = setFileMasks();
export const RANK_8: bigint = rankMasks[7];
export const RANK_4: bigint = rankMasks[3];
export const RANK_1: bigint = rankMasks[0];
export const RANK_2: bigint = rankMasks[1];
export const RANK_3: bigint = rankMasks[2];
export const RANK_5: bigint = rankMasks[4];
export const FILE_H: bigint = fileMasks[7];
export const FILE_G: bigint = fileMasks[6];
export const FILE_B: bigint = fileMasks[1];
export const FILE_A: bigint = fileMasks[0];

export function startPositions() {
	let BP1 = setRange(0n, 48, 55, 1);
	let BR1 = set(0n, 0 + 56, 1)
	BR1 = set(BR1, 7 + 56, 1)
	let BN1 = set(0n, 1 + 56, 1)
	BN1 = set(BN1, 6 + 56, 1)
	let BB1 = set(0n, 2 + 56, 1)
	BB1 = set(BB1, 5 + 56, 1)
	let BQ1 = set(0n, 3 + 56, 1)
	let BK1 = set(0n, 4 + 56, 1)

	let WP1 = setRange(0n, 8, 15, 1);
	let WR1 = set(0n, 0, 1)
	WR1 = set(WR1, 7, 1)
	let WN1 = set(0n, 1, 1)
	WN1 = set(WN1, 6, 1)
	let WB1 = set(0n, 2, 1)
	WB1 = set(WB1, 5, 1)
	let WQ1 = set(0n, 3, 1)
	let WK1 = set(0n, 4, 1)
	let BP = [BP1, 'BP']
	let BR = [BR1, 'BR']
	let BN = [BN1, 'BN']
	let BB = [BB1, 'BB']
	let BQ = [BQ1, 'BQ']
	let BK = [BK1, 'BK']

	let WP = [WP1, 'WP']
	let WR = [WR1, 'WR']
	let WN = [WN1, 'WN']
	let WB = [WB1, 'WB']
	let WQ = [WQ1, 'WQ']
	let WK = [WK1, 'WK']

	return newBoard(WP, WR, WN, WB, WQ, WK, BP, BR, BN, BB, BQ, BK)

}

export function convertMoveToUCI(move){
	let fileMap = {
		0: 'a',
		1: 'b',
		2: 'c',
		3: 'd',
		4: 'e',
		5: 'f',
		6: 'g',
		7: 'h'
	}
	let startFile = fileMap[move[0] % 8]
	let startRank = (Math.floor(move[0] / 8) + 1).toString()
	let endFile = fileMap[move[1] % 8]
	let endRank = (Math.floor(move[1] / 8) + 1).toString()
	return startFile + startRank + endFile + endRank
}