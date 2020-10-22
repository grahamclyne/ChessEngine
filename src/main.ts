import * as util from './utils'
import * as wpp from './movePossibilities'
import * as bsutil from './bitSetUtils'
import * as R from "ramda";
import * as game from './game'
import * as constants from './constants'
import * as mp from './movePossibilities'
let board = util.newBoard()

bsutil.printBitSet(mp.bishopMoves(board.get("WP"),30n))
bsutil.printBitSet(mp.rookMoves(board.get("WP"),30n))
bsutil.printBitSet(mp.knightMoves(board.get("WP"),30n))
//bsutil.printBitSet(constants.fileMasks[sq%8]|constants.rankMasks[Math.floor(sq/8)])