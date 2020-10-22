import * as util from './utils'
import * as bsutil from './bitSetUtils'
import * as R from "ramda";
import * as game from './game'
import * as constants from './constants'
import * as mp from './movePossibilities'
let board = util.newBoard()
board.set('BP', 0n);
// bsutil.printBitSet(mp.bishopMoves(board.get("WP"),30n))
// bsutil.printBitSet(mp.rookMoves(board.get("WP"),30n))
// var sq = 43
// bsutil.printBitSet(bsutil.set(0n,sq,1))
// bsutil.printBitSet(bsutil.set(0n,sq,1) >> 1n)
// bsutil.printBitSet(~constants.FILE_A)
// bsutil.printBitSet(mp.kingMoves(board.get("WP"),BigInt(sq)))
console.log(mp.getBishopMoves(board, 'W'))
//bsutil.printBitSet(constants.fileMasks[sq%8]|constants.rankMasks[Math.floor(sq/8)])