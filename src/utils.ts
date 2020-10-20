import * as bsutil from './bitSetUtils'




export function setRankMasks() {
    var rankMasks = [];
    var rank = 0n;
    var x = 0;
    while (x < 64) {
        if ((x+1) % 8 == 0 && x != 0) {
            rank = bsutil.set(rank,x,1)
            rankMasks.push(rank);
            rank = 0n;
        }
        else {
            rank = bsutil.set(rank,x,1)
        }
        x = x + 1;
    }
    return rankMasks;
}

export function setFileMasks() {
    var fileMasks = [];
    var file = 0n;
    var y = 0
    var x = 0
    while (y < 8) {
        x = y
        while (x < 64) {
            file = bsutil.set(file,x,1)
            x = x + 8
        }
        fileMasks.push(file);
        file = 0n;
        y = y + 1;
    }
    return fileMasks
}

export function prettyPrintBoard(board) {
    var bitSet = board.get("WP")
    bitSet = BigInt.asUintN(64,BigInt(bitSet))
    var white = bitSet.toString(2).split("").reverse()
    bitSet = board.get("BP")
    bitSet = BigInt.asUintN(64,BigInt(bitSet))
    var black = bitSet.toString(2).split("").reverse()
    var finBoard = Array(64);
    finBoard.fill("-- ")
    white.map((el,index) => {
        if (el == 1) {
            finBoard[index] = 'WP '
        }
    })
    black.map((el, index) => {
        if (el == 1) {
            finBoard[index] = 'BP '
        }
    })
    finBoard.map(function(el, index){
        if((index + 1) % 8 == 0 && index != 0) {
            process.stdout.write(el + "\n")
        }
        else{
            process.stdout.write(el)
        }
    })  
}
