import { BitSet } from './bitset'




export function setRankMasks() {
    var rankMasks = [];
    var rank = new BitSet();
    var x = 0;
    while (x < 64) {
        if ((x + 1) % 8 == 0 && x != 0) {
            rankMasks.push(rank.set(x, 1).clone());
            rank.clear();
        }
        else {
            rank.set(x, 1);
        }
        x = x + 1;
    }
    return rankMasks;
}

export function setFileMasks() {
    var fileMasks = [];
    var file = new BitSet();
    var y = 0
    var x = 0
    while (y < 8) {
        x = y
        while (x < 64) {
            file.set(x, 1);
            x = x + 8
        }
        fileMasks.push(file.clone());
        file.clear();
        y = y + 1;
    }
    return fileMasks
}

export function leftShift(bitSet, distance) {
    var shifted = new BitSet();
    bitSet.array.map(function (el, index, obj) {
        if (bitSet.array[index] == 1 && (index - distance) >= 0) {
            shifted.array[index - distance] = 1
        }
    })
    return shifted;
}
export function rightShift(bitSet, distance) {
    var shifted = new BitSet()
    bitSet.array.map(function (el, index, obj) {
        if (bitSet.array[index] == 1 && (index + distance) <= 63) {
            shifted.array[index + distance] = 1
        }
    })
    return shifted;
}

export function prettyPrintBoard(board) {
    var finBoard = new BitSet();
    finBoard.array.fill("-- ")
    board.get('WP').array.map(function (el, index) {
        if (el == 1) {
            finBoard.array[index] = 'WP '
        }
    })
    board.get("BP").array.map(function (el, index) {
        if (el == 1) {
            finBoard.array[index] = 'BP '
        }
    })
    finBoard.print()
}

export function and(bitSet1: BitSet, bitSet2:BitSet) {
    var anded = new BitSet()
    bitSet1.array.map(function(el,index,obj) {
        if(el == 1 && bitSet2.array[index] == 1) {
            anded.array[index] = 1;
        }

    })
    return anded
}
export function or(bitSet1: BitSet, bitSet2:BitSet) {
    var ored = new BitSet()
    bitSet1.array.map(function(el,index,obj) {
        if(el == 1 || bitSet2.array[index] == 1) {
            ored.array[index] = 1;
        }
    })
    return ored
}