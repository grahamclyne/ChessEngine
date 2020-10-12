const bs = require('bitset');

var lib = require('./lib.js')

var rankMasks = lib.setRankMasks(0,[]);
var kingMap = new bs.BitSet();
var WP = new bs.BitSet();
var WR = new bs.BitSet();
var WK = new bs.BitSet();
var WB = new bs.BitSet();
var WQ = new bs.BitSet();
var WK = new bs.BitSet();

var BP = new bs.BitSet();
var BR = new bs.BitSet();
var BK = new bs.BitSet();
var BB = new bs.BitSet();
var BQ = new bs.BitSet();
var BK = new bs.BitSet();

WP.setRange(8,15,1);
WR.set(0,1);
WR.set(7,1);
WK.set(1,1);
WK.set(6,1);
WB.set(2,1);
WB.set(5,1);
WQ.set(4,1);
WK.set(5,1);

BP.setRange(48,55,1);
BR.set(0+56,1);
BR.set(7+56,1);
BK.set(1+56,1);
BK.set(6+56,1);
BB.set(2+56,1);
BB.set(5+56,1);
BQ.set(4+56,1);
BK.set(5+56,1);


var fileMasks = lib.setFileMasks(0, [])
//fileMasks.map(x => console.log(x.toString(2)))
var pawns = BP.or(WP)
var WPPossibilities = lib.rightShift(WP,7).or(lib.rightShift(WP,9))
console.log(WPPossibilities.toString(2))