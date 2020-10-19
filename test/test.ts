import * as util from '../src/utils'
import * as wpp from '../src/movePossibilities'

import * as R from "ramda";
import * as game from '../src/game'
import { BitSet } from '../src/bitset'


//en passant testing

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
//white to the left
//WP.set(37,1)
//BP.set(38,1)
//var moveHistory = [[54,38, 'P','N']]

//white to the right
// WP.set(39,1)
// BP.set(38,1)
// var moveHistory = [[54,38, 'P','N']]

//black to the left
WP.set(29,1)
BP.set(28,1)
var moveHistory = [[13,29,'P','N']]
//black to the right
// WP.set(29,1)
// BP.set(28,1)
// var moveHistory = [[12,28,'P','N']]

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
game.play(board,moveHistory)