import * as util from './utils'
import * as wpp from './movePossibilities'
import * as bsutil from './bitSetUtils'
import * as R from "ramda";
import * as game from './game'
import * as constants from './constants'
var WP = 0n;
var WR = 0n;
var WN = 0n;
var WB = 0n;
var WQ = 0n;
var WK = 0n;
var BP = 0n;
var BR = 0n;
var BN = 0n;
var BB = 0n;
var BQ = 0n;
var BK = 0n;

WP = bsutil.setRange(WP,8,15,1);
WR = bsutil.set(WR,0,1)
WR = bsutil.set(WR,7,1)
WN = bsutil.set(WN,1,1)
WN = bsutil.set(WN,6,1)
WB = bsutil.set(WB,2,1)
WB = bsutil.set(WB,5,1)
WQ = bsutil.set(WQ,3,1)
WK = bsutil.set(WK,4,1)

BP = bsutil.setRange(BP,48,55,1);
BR = bsutil.set(BR,0+56,1)
BR = bsutil.set(BR,7+56,1)
BN = bsutil.set(BN,1+56,1)
BN = bsutil.set(BN,6+56,1)
BB = bsutil.set(BB,2+56,1)
BB = bsutil.set(BB,5+56,1)
BQ = bsutil.set(BQ,3+56,1)
BK = bsutil.set(BK,4+56,1)

var board = new Map()
board.set('WP',WP)
board.set('WN',WN)
board.set('WB',WB)
board.set('WR',WR)
board.set('WQ',WQ)
board.set('WK',WK)
board.set('BP',BP)
board.set('BN',BN)
board.set('BB',BB)
board.set('BR',BR)
board.set('BQ',BQ)
board.set('BK',BK)
var moveHistory = []
game.play(board,moveHistory)
//"C:\Users\Graham Clyne\Documents\chessEngine\node_modules\.bin\tsc.cmd" && node dist\src\main.js
