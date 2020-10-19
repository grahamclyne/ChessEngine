import * as util from './utils'
import * as wpp from './movePossibilities'

import * as R from "ramda";
import * as game from './game'
import { BitSet } from './bitset';
import { moveCursor } from 'readline';


var WP = new BitSet();
var WR = new BitSet();
var WN = new BitSet();
var WB = new BitSet();
var WQ = new BitSet();
var WK = new BitSet();

var BP = new BitSet();
var BR = new BitSet();
var BN = new BitSet();
var BB = new BitSet();
var BQ = new BitSet();
var BK = new BitSet();

WP.setRange(8,15,1);
WR.set(0,1);
WR.set(7,1);
WN.set(1,1);
WN.set(6,1);
WB.set(2,1);
WB.set(5,1);
WQ.set(4,1);
WK.set(5,1);

BP.setRange(48,55,1);
BR.set(0+56,1);
BR.set(7+56,1);
BN.set(1+56,1);
BN.set(6+56,1);
BB.set(2+56,1);
BB.set(5+56,1);
BQ.set(4+56,1);
BK.set(5+56,1);
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
