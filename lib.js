//bitmasks already not functional.....
const bs = require('bitset');
const R = require("ramda");



//do this functionally?

exports.setRankMasks = function (x, rankMasks) {
    var rank = new bs.BitSet();
    while(x < 64) {
        if((x+1) % 8 == 0 && x != 0) {
            rankMasks.push(rank.set(x,1).clone());
            rank.clear();
        }
        else {
            rank.set(x,1);
        }
        x = x + 1;
    }
    return rankMasks;
}

exports.setFileMasks = function( x, fileMasks) {
    var file = new bs.BitSet();
    y = 0
    while(y < 8) {
        x = y
        while(x < 64) {
            file.set(x,1);
            x = x + 8 
        }
        fileMasks.push(file.clone());
        file.clear();
        y = y + 1;
    }
    return fileMasks
}

exports.leftShift = function (bitSet, distance) {
    var lsb = bitSet.lsb()
    var msb = bitSet.msb()
    var output = new bs.BitSet()
    while(lsb < msb){
        var isSet = bitSet.get(lsb)
        if(isSet){
            output.set((lsb - distance), 1)
        }
        lsb = lsb + 1
    }
    return output
}

exports.rightShift = function (bitSet, distance) {
    var lsb = bitSet.lsb()
    var msb = bitSet.msb()
    var output = new bs.BitSet()
    while(lsb < msb){
        var isSet = bitSet.get(lsb)
        if(isSet){
            output.set((lsb + distance), 1)
        }
        lsb = lsb + 1
    }
    return output
}

exports.whitePawnPossibilities(WP){
    
}