//bitmasks already not functional.....
const bs = require('bitset');
const R = require("ramda");



//do this functionally?

exports.setRankMasks = function (x, rankMasks) {
    var rank = new bs.BitSet();
    while(x < 65) {
        if((x+1) % 8 == 0 && x != 0) {
            rankMasks.push(rank.set(x,1).clone());
            rank.clear();
        }
        else {
            rank.set(x,1);
        }
        x = x + 1;
    }
    
    rankMasks.map(x => console.log(x.toString()));
}
