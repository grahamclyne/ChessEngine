import * as bsutil from './bitSetUtils'
import { fileMasks } from './constants';
import * as constants from './constants'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';


export function setRankMasks() {
    let rankMasks = [];
    let rank = 0n;
    let x = 0;
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
    let fileMasks = [];
    let file = 0n;
    let y = 0
    let x = 0
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
    let finBoard = Array(64);
    finBoard.fill("-- ")
    board.forEach((key,value) => {
        let bitSet = BigInt.asUintN(64,BigInt(key))
        let black = bitSet.toString(2).split("").reverse()   
        black.map((el, index) => {
            if (el == '1') {
                finBoard[index] = value + " "
            }
        })
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


export function newBoard(...pieces) {
let board = new Map()
board.set('WP', 0n)
board.set('WN', 0n)
board.set('WB', 0n)
board.set('WR', 0n)
board.set('WQ', 0n)
board.set('WK', 0n)
board.set('BP', 0n)
board.set('BN', 0n)
board.set('BB', 0n)
board.set('BR', 0n)
board.set('BQ', 0n)
board.set('BK', 0n)
for(var i in pieces){
	board.set(pieces[i][1], pieces[i][0])
}
return board;
}

// static long DiagonalMasks8[] =/*from top left to bottom right*/
// {
// 0x1L, 0x102L, 0x10204L, 0x1020408L, 0x102040810L, 0x10204081020L, 0x1020408102040L,
// 0x102040810204080L, 0x204081020408000L, 0x408102040800000L, 0x810204080000000L,
// 0x1020408000000000L, 0x2040800000000000L, 0x4080000000000000L, 0x8000000000000000L
// };
// static long AntiDiagonalMasks8[] =/*from top right to bottom left*/
// {
// 0x80L, 0x8040L, 0x804020L, 0x80402010L, 0x8040201008L, 0x804020100804L, 0x80402010080402L,
// 0x8040201008040201L, 0x4020100804020100L, 0x2010080402010000L, 0x1008040201000000L,
// 0x804020100000000L, 0x402010000000000L, 0x201000000000000L, 0x100000000000000L
// };


//find how to generate own 
//thanks tord romstad -creator of stockfish
export const magicR =[
	0x11800040001481a0n,
	0x2040400010002000n,
	0xa280200308801000n,
	0x100082005021000n,
	0x280280080040006n,
	0x200080104100200n,
	0xc00040221100088n,
	0xe00072200408c01n,
	0x2002045008600n,
	0xa410804000200089n,
	0x4081002000401102n,
	0x2000c20420010n,
	0x800800400080080n,
	0x40060010041a0009n,
	0x441004442000100n,
	0x462800080004900n,
	0x80004020004001n,
	0x1840420021021081n,
	0x8020004010004800n,
	0x940220008420010n,
	0x2210808008000400n,
	0x24808002000400n,
	0x803604001019a802n,
	0x520000440081n,
	0x802080004000n,
	0x1200810500400024n,
	0x8000100080802000n,
	0x2008080080100480n,
	0x8000404002040n,
	0xc012040801104020n,
	0xc015000900240200n,
	0x20040200208041n,
	0x1080004000802080n,
	0x400081002110n,
	0x30002000808010n,
	0x2000100080800800n,
	0x2c0800400800800n,
	0x1004800400800200n,
	0x818804000210n,
	0x340082000a45n,
	0x8520400020818000n,
	0x2008900460020n,
	0x100020008080n,
	0x601001000a30009n,
	0xc001000408010010n,
	0x2040002008080n,
	0x11008218018c0030n,
	0x20c0080620011n,
	0x400080002080n,
	0x8810040002500n,
	0x400801000200080n,
	0x2402801000080480n,
	0x204040280080080n,
	0x31044090200801n,
	0x40c10830020400n,
	0x442800100004080n,
	0x10080002d005041n,
	0x134302820010a2c2n,
	0x6202001080200842n,
	0x1820041000210009n,
	0x1002001008210402n,
	0x2000108100402n,
	0x10310090a00b824n,
	0x800040100944822n
]
