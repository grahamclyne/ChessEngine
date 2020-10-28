import * as utils from './utils'
import * as bsutil from './bitSetUtils'
import * as game from './game'
import * as constants from './constants'
import * as moves from './moves'
import * as check from './check'
import {reduce} from 'lodash'
let BP1 = bsutil.setRange(0n, 48, 55, 1);
let BR1 = bsutil.set(0n, 0 + 56, 1)
BR1 = bsutil.set(BR1, 7 + 56, 1)
let BN1 = bsutil.set(0n, 1 + 56, 1)
BN1 = bsutil.set(BN1, 6 + 56, 1)
let BB1 = bsutil.set(0n, 2 + 56, 1)
BB1 = bsutil.set(BB1, 5 + 56, 1)
let BQ1 = bsutil.set(0n, 3 + 56, 1)
let BK1 = bsutil.set(0n, 4 + 56, 1)
let WP1 = bsutil.setRange(0n, 8, 15, 1);
let WR1 = bsutil.set(0n, 0, 1)
WR1 = bsutil.set(WR1, 7, 1)
let WN1 = bsutil.set(0n, 1, 1)
WN1 = bsutil.set(WN1, 6, 1)
let WB1 = bsutil.set(0n, 2, 1)
WB1 = bsutil.set(WB1, 5, 1)
let WQ1 = bsutil.set(0n, 3, 1)
let WK1 = bsutil.set(0n, 4, 1)

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

let board = utils.newBoard(WP, WR, WN, WB, WQ, WK, BP, BR, BN, BB, BQ, BK)
let opponent = 'HUM'
game.play(board, [], opponent)
