import * as utils from './utils'
import * as constants from './constants'
import * as bsutil from './bitSetUtils'
import * as R from "ramda";
import * as magic from "./magic"
import { DH_NOT_SUITABLE_GENERATOR, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';



export function getPawnMoves(board, colour, history) {
    let BOARD_STATE = 0
    BOARD_STATE = R.reduce(function (x, y) { return x | y }, BOARD_STATE, Array.from(board.values))
    let possibleMoves = []
    let OFF_LIMIT_PIECES;
    let OPPOSING_PIECES
    let EMPTY;
    let shiftFunction;
    let lastRank;
    let leftSide;
    let rightSide;
    let twoForward;
    let operator;
    let piecesToMove;
    let enpassant;
    if (colour == 'W') {
        OFF_LIMIT_PIECES = ~(board.get('WP') | board.get('WN') | board.get('WB') | board.get('WR') | board.get('WQ') | board.get('WK') | board.get('BK')); //added *K to avoid illegal capture
        OPPOSING_PIECES = (board.get('BP') | (board.get('BN')) | (board.get('BB')) | (board.get('BR')) | (board.get('BQ'))); //omitted *K to avoid illegal capture
        EMPTY = board.get('WP') | (board.get('WN')) | (board.get('WB')) | (board.get('WR')) | (board.get('WQ')) | (board.get('WK')) | (board.get('BP')) | (board.get('BN')) | (board.get('BB')) | (board.get('BR')) | (board.get('BQ')) | (~board.get('BK'));
        shiftFunction = function (x, y) { return x << y }
        lastRank = constants.RANK_8;
        leftSide = constants.FILE_A;
        rightSide = constants.FILE_H;
        twoForward = constants.RANK_4;
        operator = function (a, b) { return a - b }
        enpassant = function (a, b) { return a + b }
        piecesToMove = board.get("WP");
    }
    else {
        OFF_LIMIT_PIECES = ~(board.get("BP") | board.get("BN") | board.get("BB") | board.get("BR") | board.get("BQ") | board.get("BK") | board.get("WK"));
        OPPOSING_PIECES = board.get('WP') | board.get('WN') | board.get('WB') | board.get('WR') | board.get('WQ');
        EMPTY = board.get('BP') | board.get('BN') | board.get('BB') | board.get('BR') | board.get('BQ') | board.get('BK') | board.get('WP') | board.get('WN') | board.get('WB') | board.get('WR') | board.get('WQ') | ~board.get('WK');
        shiftFunction = function (x, y) { return x >> y }
        lastRank = constants.RANK_1;
        leftSide = constants.FILE_H;
        rightSide = constants.FILE_A;
        twoForward = constants.RANK_5;
        operator = function (a, b) { return a + b }
        enpassant = function (a, b) { return a - b }
        piecesToMove = board.get('BP');
    }

    //check for en passant
    let lastMove = history[history.length - 1]
    if (lastMove != null && (lastMove[2] == 'P') && Math.abs(lastMove[1] - lastMove[0]) == 16) { //if last move was a pawn moving two sqs
        if (bsutil.get(piecesToMove, lastMove[1] + 1) == 1) { //to the right if white, to the left if black
            possibleMoves.push([lastMove[1] + 1, enpassant(lastMove[1], 8), 'P', 'EN'])
        }
        else if (bsutil.get(piecesToMove, lastMove[1] - 1) == 1) {
            possibleMoves.push([lastMove[1] - 1, enpassant(lastMove[1], 8), 'P', 'EN'])
        }
    }

    //capture right
    let PAWN_MOVES = shiftFunction(piecesToMove, 7n) & (OPPOSING_PIECES) & (~lastRank) & (~rightSide);
    let f1 = function (num) { return (operator(num, 7)) }
    let f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'N'))

    //1 forward
    PAWN_MOVES = (shiftFunction(piecesToMove, 8n) & (EMPTY) & (~lastRank));
    f1 = function (num) { return (operator(num, 8)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'N'))

    // //capture left
    PAWN_MOVES = shiftFunction(piecesToMove, 7n) & (OPPOSING_PIECES) & (~lastRank) & (~leftSide);
    f1 = function (num) { return (operator(num, 7)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'N'))

    //move 2 forward
    PAWN_MOVES = (shiftFunction(piecesToMove, 16n) & (EMPTY) & (shiftFunction(EMPTY, 8n)) & (twoForward));
    f1 = function (num) { return (operator(num, 16)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'N'))

    //promotion type 'P'
    //pawn promotion by capture right
    PAWN_MOVES = (shiftFunction(piecesToMove, 7n) & (OPPOSING_PIECES) & (lastRank) & (~rightSide));
    f1 = function (num) { return (operator(num, 7)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'P'))

    //pawn promotion by move 1 forward
    PAWN_MOVES = (shiftFunction(piecesToMove, 8n) & (EMPTY) & (lastRank))
    f1 = function (num) { return (operator(num, 8)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'P'))

    //pawn promotion by capture left
    PAWN_MOVES = (shiftFunction(piecesToMove, 9n) & (OPPOSING_PIECES) & (lastRank) & (~leftSide))
    f1 = function (num) { return (operator(num, 9)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'P'))
    return possibleMoves
}

export function generatePossibleMoves(bitSet, f1, f2, piece, moveType) {
    let possibleMoves = []
    let pos = 0
    for (let index = 0; index < 64; index++) {
        let el = bsutil.get(bitSet, index)
        if (el == 1) {
            let start = f1(index)
            let end = f2(index)
            possibleMoves.push([start, end, piece, moveType])
        }
    }

    return possibleMoves;
}




export function rookMoves(occ, sq) {
    //could use whole occupancy board,but would map to too many possibilties, following line gives us a reduced occupancy that is much more manageable
    let occ1 =occ
    bsutil.printBitSet(bsutil.set(0n, Number(sq), 1))
    bsutil.printBitSet(occ)
    bsutil.printBitSet(magic.rMask(sq))
    occ &= magic.rMask(sq);
    //
    bsutil.printBitSet(occ)
    occ *= magic.rook_magic_numbers[sq];
  //  occ *= magic.findMagic(sq,utils.nRBits[sq],0)
    bsutil.printBitSet(occ)
    occ >>= (64n - BigInt(magic.nRBits[Number(sq)]))
    console.log("FINAL")
    bsutil.printBitSet(occ)
    return magic.rookAttacksOnTheFly(occ1, sq)
}

export function getRookMoves(board,colour){
    let possibleMoves = []
    let rooks = (colour == 'W') ? board.get("WR") : board.get("BR");
    let rookPiece = BigInt(bsutil.msb(rooks))
    let occ = R.reduce((x,y) => {return x | y}, 0n, Array.from(board.values()))
    let bb = rookMoves(occ,rookPiece)
    bsutil.printBitSet(bb)
    return generatePossibleMoves(bb, (x) => rookPiece, (x) => x, "R", "N")
}
export function bishopMoves(occ, sq) {
    //  occ &= magic.rMask(sq);
    //  occ *= utils.magicR[sq];
    //  occ >>= (64n - BigInt(magic.nRBits[sq]))
     return magic.bishopAttacksOnTheFly(occ, sq)
}

export function knightMoves(occ, sq) {
    let attacks = 0n
    let bitboard = bsutil.set(0n, sq, 1)
    if ((bitboard >> 17n) & ~constants.FILE_H) attacks |= (bitboard >> 17n);
    if ((bitboard >> 15n) & ~constants.FILE_A) attacks |= (bitboard >> 15n);
    if ((bitboard >> 10n) & (~constants.FILE_H & ~constants.FILE_G)) attacks |= (bitboard >> 10n);
    if ((bitboard >> 6n) & (~constants.FILE_A & ~constants.FILE_B)) attacks |= (bitboard >> 6n);
    if ((bitboard << 17n) & ~constants.FILE_A) attacks |= (bitboard << 17n);
    if ((bitboard << 15n) & ~constants.FILE_H) attacks |= (bitboard << 15n);
    if ((bitboard << 10n) & (~constants.FILE_A & ~constants.FILE_B)) attacks |= (bitboard << 10n);
    if ((bitboard << 6n) & (~constants.FILE_H & ~constants.FILE_G)) attacks |= (bitboard << 6n);
    attacks = BigInt.asUintN(64, BigInt(attacks))
    return attacks
}

export function queenMoves(occ, sq) {
    // occ &= rMask(sq);
    // occ *= utils.magicR[sq];
    // occ >>= (64n - BigInt(utils.nRBits[sq]))
    // return bishopAttacksOnTheFly(occ, sq) | rookAttacksOnTheFly(occ, sq)
}

export function kingMoves(occ, sq) {
    let attacks = 0n;
    let bitboard = bsutil.set(0n, Number(sq), 1)
    //the not constants.FILE_H is to stop wraparound!!!
    if ((bitboard >> 1n) & ~constants.FILE_H) attacks |= (bitboard >> 1n);
    if ((bitboard >> 7n) & ~constants.FILE_A) attacks |= (bitboard >> 7n);
    attacks |= (bitboard >> 8n);
    if ((bitboard >> 9n) & ~constants.FILE_H) attacks |= (bitboard >> 9n);
    if ((bitboard << 1n) & ~constants.FILE_A) attacks |= (bitboard << 1n);
    if ((bitboard << 7n) & ~constants.FILE_H) attacks |= (bitboard << 7n);
    attacks |= (bitboard << 8n);
    if ((bitboard << 9n) & ~constants.FILE_A) attacks |= (bitboard << 9n);
    attacks = BigInt.asUintN(64, BigInt(attacks)) //truncate... this probably slowing things down? 
    return attacks
}
