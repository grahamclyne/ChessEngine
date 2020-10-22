import * as utils from './utils'
import * as constants from './constants'
import * as bsutil from './bitSetUtils'
import * as R from "ramda";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';



export function pawnPossibilities(board, colour, history) {
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

export function rookMoveshyberbola(board) {
    let movePossibilities = []
    let BOARD_STATE = 0n

    BOARD_STATE = R.reduce(function (x, y) { return x | y }, BOARD_STATE, Array.from(board.values()))

    let rooksonboard = board.get("WR");
    let firstRook = bsutil.lsb(rooksonboard)
    let secondRook = bsutil.msb(rooksonboard)


    //https://www.chessprogramming.org/Subtracting_a_Rook_from_a_Blocking_Piece
    //https://www.chessprogramming.org/Hyperbola_Quintessence
    let rooks = [firstRook]
    for (var j in rooks) {
        console.log('rook' + rooks[j])
        let rank = constants.rankMasks[Math.floor(rooks[j] / 8)]
        let file = constants.fileMasks[Math.floor(rooks[j] % 8)]
        let masks = [rank, file]
        let slider = bsutil.set(0n, rooks[j], 1);
        bsutil.printBitSet(slider)
        for (var i in masks) {
            console.log("MASK")

            let occupied = masks[i] & (BOARD_STATE)
            // lineAttacks=(o-2r) ^ reverse( o'-2r')
            var nonreversed = ((occupied) - (2n * slider))
            var reversed = bsutil.reverse(bsutil.reverse(occupied) - (2n * bsutil.reverse(slider)))
            bsutil.printBitSet(occupied)
            bsutil.printBitSet(slider)
            bsutil.printBitSet(occupied - slider)
            bsutil.printBitSet(occupied - (2n * slider))
            bsutil.printBitSet(nonreversed)
            console.log("REVERSE")
            bsutil.printBitSet(bsutil.reverse(occupied))
            bsutil.printBitSet(bsutil.reverse(slider))
            bsutil.printBitSet(bsutil.reverse(occupied) - bsutil.reverse(slider))
            bsutil.printBitSet(bsutil.reverse(occupied) - (2n * bsutil.reverse(slider)))
            bsutil.printBitSet(nonreversed)
            let lineAttacks = (nonreversed ^ reversed) & masks[i]
            bsutil.printBitSet(lineAttacks)
            console.log('\n')
            break
        }
    }
    // occupied=11000101
    // slider=00000100
    // o-s=11000001
    // o-2s=10111101
    // left=o^(o-2s)=01111000
    // reverse(10011)=11001 
    // right=(o'^(o'-2s'))'=00000011
    //  reverse(a^b)=reverse(a)^reverse(b)
    // right=o^(o'-2s')'
    // lineAttacks=right^left
    // lineAttacks= (o-2s) ^ (o'-2s')'
    // m=mask

    return movePossibilities
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


export function rMask(sq: bigint) {
    let result = 0n;
    let rk = sq / 8n, fl = sq % 8n, r, f;
    for (r = rk + 1n; r <= 6n; r++) result |= (1n << (fl + r * 8n));
    for (r = rk - 1n; r >= 1n; r--) result |= (1n << (fl + r * 8n));
    for (f = fl + 1n; f <= 6n; f++) result |= (1n << (f + rk * 8n));
    for (f = fl - 1n; f >= 1n; f--) result |= (1n << (f + rk * 8n));
    return result;
}


export function bMask(sq: bigint) {
    let result = 0n;
    let rk = sq / 8n, fl = sq % 8n, r, f;
    for (r = rk + 1n, f = fl + 1n; r <= 6n && f <= 6n; r++, f++) result |= (1n << (f + r * 8n));
    for (r = rk + 1n, f = fl - 1n; r <= 6n && f >= 1n; r++, f--) result |= (1n << (f + r * 8n));
    for (r = rk - 1n, f = fl + 1n; r >= 1n && f <= 6n; r--, f++) result |= (1n << (f + r * 8n));
    for (r = rk - 1n, f = fl - 1n; r >= 1n && f >= 1n; r--, f--) result |= (1n << (f + r * 8n));
    return result;
}

export function rookMoves(occ, sq) {
    occ &= rMask(sq);
    occ *= utils.magicR[sq];
    occ >>= (64n - BigInt(utils.nRBits[sq]))
    return rookAttacksOnTheFly(occ, sq)
}
export function bishopMoves(occ, sq) {
    occ &= rMask(sq);
    occ *= utils.magicR[sq];
    occ >>= (64n - BigInt(utils.nRBits[sq]))
    return bishopAttacksOnTheFly(occ, sq)
}
export function knightMoves(occ, sq) {
    let attacks = 0n;
    let rank = (sq/8n) + 1n 
    let file = (sq%8n) + 2n
    attacks |= 1n << (rank + file)
    attacks |= 1n << (sq + 8n - 3n)
    attacks |= 1n << (sq - 8n + 3n)
    attacks |= 1n << (sq - 8n - 3n)
    attacks |= 1n << (sq + 1n + 24n)
    attacks |= 1n << (sq + 1n - 24n)
    attacks |= 1n << (sq - 1n + 24n)
    attacks |= 1n << (sq - 1n - 24n)
    return attacks
}

export function knightAttacksOnTheFly(occ,sq){

}

export function bishopAttacksOnTheFly(occ, sq) {
    let attacks = 0n;
    let pieceRank = sq / 8n, pieceFile = sq % 8n, rank, file;
    for (rank = pieceRank + 1n, file = pieceFile + 1n; rank <= 7n && file <= 7n; rank++, file++) {
        let pos = (1n << (rank * 8n + file))
        attacks |= (pos);
        if (pos & occ) break;
    }
    for (rank = pieceRank + 1n, file = pieceFile - 1n; rank <= 7n && file >= 0n; rank++, file--) {
        let pos = (1n << (rank * 8n + file))
        attacks |= (pos);
        if (pos & occ) break;
    }
    for (rank = pieceRank - 1n, file = pieceFile + 1n; rank >= 0n && file <= 7n; rank--, file++) {
        let pos = (1n << (rank * 8n + file))
        attacks |= (pos);
        if (pos & occ) break;
    }
    for (rank = pieceRank - 1n, file = pieceFile - 1n; rank >= 0n && file >= 0n; rank--, file--) {
        let pos = (1n << (rank * 8n + file))
        attacks |= (pos);
        if (pos & occ) break;
    }
    return attacks;
}
export function rookAttacksOnTheFly(occ, sq) {

    let attacks = 0n;
    let pieceRank = sq / 8n, pieceFile = sq % 8n, rank, file;
    //rank to the right 
    for (rank = pieceRank + 1n; rank <= 7n; rank++) {
        //set bit to 1 (1n << ...) if not anded with occ)
        attacks |= (1n << (rank * 8n + pieceFile));
        if ((1n << (rank * 8n + pieceFile)) & occ) break;
    }
    //rank to the left
    for (rank = pieceRank - 1n; rank >= 0; rank--) {
        attacks |= (1n << (rank * 8n + pieceFile));
        if ((1n << (rank * 8n + pieceFile)) & occ) break;
    }
    //file above
    for (file = pieceFile + 1n; file <= 7n; file++) {
        attacks |= (1n << (pieceRank * 8n + file));
        if ((1n << (pieceRank * 8n + file)) & occ) break;
    }
    //file below
    for (file = pieceFile - 1n; file >= 0; file--) {
        attacks |= (1n << (pieceRank * 8n + file));
        if ((1n << (pieceRank * 8n + file)) & occ) break;
    }
    // return attack map
    return attacks;
}