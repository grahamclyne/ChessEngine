import * as bsutil from './bitSetUtils'
import { reduce } from 'lodash'

export function setRankMasks() {
	let rankMasks = [];
	let rank = 0n;
	let x = 0;
	while (x < 64) {
		if ((x + 1) % 8 == 0 && x != 0) {
			rank = bsutil.set(rank, x, 1)
			rankMasks.push(rank);
			rank = 0n;
		}
		else {
			rank = bsutil.set(rank, x, 1)
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
			file = bsutil.set(file, x, 1)
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

export function pow(b: bigint, exponent: number): bigint {
	let output = 1n
	while (exponent > 0) {
		output = b * output
		exponent--
	}
	return output
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