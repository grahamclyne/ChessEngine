import * as util from './util'
import * as bsutil from './bitSetUtils'
import * as magic from "./magic"
import * as game from './game'
import * as check from './check'
import { reduce } from "lodash"


export function getPawnMoves(board, colour, history) {

    let possibleMoves = []
    let oppColour = (colour == 'W') ? 'B' : 'W'
    let OPPOSING_PIECES = (board.get(oppColour + 'P') | (board.get(oppColour + 'N')) | (board.get(oppColour + 'B')) | (board.get(oppColour + 'R')) | (board.get(oppColour + 'Q'))); //omitted *K to avoid illegal capture
    let EMPTY = bsutil.not(board.get(colour + 'P') | (board.get(colour + 'N')) | (board.get(colour + 'B')) | (board.get(colour + 'R')) | (board.get(colour + 'Q')) | (board.get(colour + 'K')) | (board.get(oppColour + 'P')) | (board.get(oppColour + 'N')) | (board.get(oppColour + 'B')) | (board.get(oppColour + 'R')) | (board.get(oppColour + 'Q')) | board.get(oppColour + 'K'));
    let shiftFunction;
    let lastRank;
    let leftSide;
    let rightSide;
    let twoForward;
    let operator;
    let piecesToMove = board.get(colour + 'P');
    let enpassant;
    if (colour == 'W') {
        shiftFunction = function (x, y) { return x << y }
        lastRank = util.RANK_8;
        leftSide = util.FILE_A;
        rightSide = util.FILE_H;
        twoForward = util.RANK_4;
        operator = function (a, b) { return a - b }
        enpassant = function (a, b) { return a + b }
    }
    else {
        shiftFunction = function (x, y) { return x >> y }
        lastRank = util.RANK_1;
        leftSide = util.FILE_H;
        rightSide = util.FILE_A;
        twoForward = util.RANK_5;
        operator = function (a, b) { return a + b }
        enpassant = function (a, b) { return a - b }
    }

    //check for en passant
    let lastMove = history[history.length - 1]
    if (lastMove != null && (lastMove[2] == 'P') && Math.abs(lastMove[1] - lastMove[0]) == 16) { //if last move was a pawn moving two sqs
        if (bsutil.get(piecesToMove, lastMove[1] + 1) == 1) { //to the right if white, to the left if black
            possibleMoves.push([lastMove[1] + 1, enpassant(lastMove[1], 8), 'P', 'EN', 'N'])
        }
        else if (bsutil.get(piecesToMove, lastMove[1] - 1) == 1) {
            possibleMoves.push([lastMove[1] - 1, enpassant(lastMove[1], 8), 'P', 'EN', 'N'])
        }
    }

    //capture right
    let PAWN_MOVES = shiftFunction(piecesToMove, 7n) & (OPPOSING_PIECES) & (bsutil.not(lastRank)) & (bsutil.not(rightSide));
    let f1 = function (num) { return (operator(num, 7)) }
    let f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'N'))

    //1 forward
    PAWN_MOVES = shiftFunction(piecesToMove, 8n) & EMPTY & bsutil.not(lastRank);
    f1 = function (num) { return (operator(num, 8)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'N'))

    //capture left
    PAWN_MOVES = shiftFunction(piecesToMove, 9n) & (OPPOSING_PIECES) & bsutil.not(lastRank) & bsutil.not(leftSide);
    f1 = function (num) { return (operator(num, 9)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'N'))

    //move 2 forward
    PAWN_MOVES = (shiftFunction(piecesToMove, 16n) & (EMPTY) & (shiftFunction(EMPTY, 8n)) & (twoForward));
    f1 = function (num) { return (operator(num, 16)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'N'))

    //promotion type 'P'
    //pawn promotion by capture right
    PAWN_MOVES = (shiftFunction(piecesToMove, 7n) & (OPPOSING_PIECES) & lastRank & bsutil.not(rightSide));
    f1 = function (num) { return (operator(num, 7)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'P'))

    //pawn promotion by move 1 forward
    PAWN_MOVES = (shiftFunction(piecesToMove, 8n) & (EMPTY) & (lastRank))
    f1 = function (num) { return (operator(num, 8)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'P'))

    //pawn promotion by capture left
    PAWN_MOVES = shiftFunction(piecesToMove, 9n) & (OPPOSING_PIECES) & (lastRank) & (bsutil.not(leftSide))
    f1 = function (num) { return (operator(num, 9)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'P'))
    return possibleMoves
}

export function generatePossibleMoves(bitSet, f1, f2, piece, moveType) {
    let possibleMoves = []
    for (let index = 0; index < 64; index++) {
        let el = bsutil.get(bitSet, index)
        if (el == 1) {
            let start = f1(index)
            let end = f2(index)
            possibleMoves.push([start, end, piece, moveType, 'N'])
        }
    }
    return possibleMoves;
}

export function pawnAttacks(pawnBoard, colour) {
    let attacks = 0n;
    if (colour == 'W') {
        attacks |= (pawnBoard << 7n) & bsutil.not(util.FILE_H);
        attacks |= (pawnBoard << 9n) & bsutil.not(util.FILE_A);
    }
    else {
        attacks |= (pawnBoard >> 7n) & bsutil.not(util.FILE_A);
        attacks |= (pawnBoard >> 9n) & bsutil.not(util.FILE_H);
    }
    return [[attacks, 0n, "P"]];
}

export function rookMoves(occ, sq) {
    //could use whole occupancy board,but would map to too many possibilties, following line gives us a reduced occupancy that is much more manageable
    //use same magic number while instantiating rook_moves array as for rook_magic_numbers
     let occ1 = occ
    occ &= magic.rMask(sq);
    occ *= magic.rook_magic_numbers[sq];
    occ >>= (64n - BigInt(magic.nRBits[Number(sq)]))
    return BigInt(magic.rook_attacks[sq][Number(occ)])
    //return magic.rookAttacksOnTheFly(occ1, sq)
}

export function bishopMoves(occ, sq) {
  //  console.log(occ,sq)
     occ &= magic.bMask(sq);
     occ *= magic.bishop_magic_numbers[sq];
     occ >>= (64n - BigInt(magic.nBBits[Number(sq)]))
 //    console.log(occ, Number(occ))
    let out = magic.bishop_attacks[sq][Number(occ)]
    // console.log(magic.bishop_attacks[sq])
    // console.log(out)
    return BigInt(out)
}

export function knightMoves(sq) {
    let attacks = 0n
    let bitboard = bsutil.set(0n, sq, 1)
    if ((bitboard >> 17n) & bsutil.not(util.FILE_H)) attacks |= (bitboard >> 17n);
    if ((bitboard >> 15n) & bsutil.not(util.FILE_A)) attacks |= (bitboard >> 15n);
    if ((bitboard >> 10n) & bsutil.not(util.FILE_H) & bsutil.not(util.FILE_G)) attacks |= (bitboard >> 10n);
    if ((bitboard >> 6n) & bsutil.not(util.FILE_A) & bsutil.not(util.FILE_B)) attacks |= (bitboard >> 6n);
    if ((bitboard << 17n) & bsutil.not(util.FILE_A)) attacks |= (bitboard << 17n);
    if ((bitboard << 15n) & bsutil.not(util.FILE_H)) attacks |= (bitboard << 15n);
    if ((bitboard << 10n) & bsutil.not(util.FILE_A) & bsutil.not(util.FILE_B)) attacks |= (bitboard << 10n);
    if ((bitboard << 6n) & bsutil.not(util.FILE_H) & bsutil.not(util.FILE_G)) attacks |= (bitboard << 6n);
    attacks = BigInt.asUintN(64, BigInt(attacks))
    return attacks
}

export function queenMoves(occ, sq) {
    // occ &= rMask(sq);
    // occ *= utils.magicR[sq];
    // occ >>= (64n - BigInt(utils.nRBits[sq]))
    return magic.bishopAttacksOnTheFly(occ, sq) | magic.rookAttacksOnTheFly(occ, sq)
}

export function kingMoves(sq) {
    let attacks = 0n;
    let bitboard = bsutil.set(0n, sq, 1)
    //the not util.FILE_H is to stop wraparound!!!
    if ((bitboard >> 1n) & bsutil.not(util.FILE_H)) attacks |= (bitboard >> 1n);
    if ((bitboard >> 7n) & bsutil.not(util.FILE_A)) attacks |= (bitboard >> 7n);
    attacks |= (bitboard >> 8n);
    if ((bitboard >> 9n) & bsutil.not(util.FILE_H)) attacks |= (bitboard >> 9n);
    if ((bitboard << 1n) & bsutil.not(util.FILE_A)) attacks |= (bitboard << 1n);
    if ((bitboard << 7n) & bsutil.not(util.FILE_H)) attacks |= (bitboard << 7n);
    attacks |= (bitboard << 8n);
    if ((bitboard << 9n) & bsutil.not(util.FILE_A)) attacks |= (bitboard << 9n);
    attacks = BigInt.asUintN(64, BigInt(attacks)) //truncate... this probably slowing things down? 
    return attacks
}

//get the places a king can actually move
export function kingMovesActual(sq: number, attackBoard: bigint, pieces) {
    return kingMoves(sq) & (bsutil.not(attackBoard)) & bsutil.not(pieces)
}

//get all the moves a piece can actually move
export function getPieceMoves(bitBoard, occ, pieces, f, pieceName) {
    if (bitBoard == 0n) { //none of these pieces exist
        return []
    }
    //scenario not covered where player has more than two queens
    let piece1 = BigInt(bsutil.msb(bitBoard))
    let piece2 = BigInt(bsutil.lsb(bitBoard))
    if (piece1 == piece2) {
        return [[f(occ, piece1) & BigInt(bsutil.not(pieces)), piece1, pieceName]]
    }
    else {
        return [[f(occ, piece1) & BigInt(bsutil.not(pieces)), piece1, pieceName],
        [f(occ, piece2) & BigInt(bsutil.not(pieces)), piece2, pieceName]]
    }
}

export function convertMovesToList(board, piece, pieceName) {
    return generatePossibleMoves(board, (x) => Number(piece), x => Number(x), pieceName, "N")
}


//the one outward point to game.ts??
export function getMoves(board, colour, history) {
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    let oppColour = (colour == 'W') ? 'B' : 'W'
    let PIECES = board.get(colour + 'P') | board.get(colour + 'N') | board.get(colour + 'B') | board.get(colour + 'R') | board.get(colour + 'Q') | board.get(colour + 'K')
    let moves = getPieceMoves(board.get(colour + 'K'), occupancy, PIECES, (x, y) => kingMovesActual(y, getAttackBoard(oppColour, board, true), PIECES), "K")
        .concat(getPieceMoves(board.get(colour + 'Q'), occupancy, PIECES, queenMoves, "Q"))
        .concat(getPieceMoves(board.get(colour + 'N'), occupancy, PIECES, (x, y) => knightMoves(y), "N"))
        .concat(getPieceMoves(board.get(colour + 'B'), occupancy, PIECES, bishopMoves, 'B'))
        .concat(getPieceMoves(board.get(colour + 'R'), occupancy, PIECES, rookMoves, "R"))
    let pawns = getPawnMoves(board, colour, history)
    let movesFin = []
    for (let i in moves) {
        movesFin = movesFin.concat(convertMovesToList(moves[i][0], moves[i][1], moves[i][2]))
    }
    //need to set capture before finding no check moves in case scenario where capture to get out of check
    let movesWithCapture = findCaptures(movesFin.concat(pawns), board, colour)
    let movesNoCheck = findNoCheckMoves(movesWithCapture, board, colour)
    if (canCastleKingSide(occupancy, history, colour,board)) {
        movesNoCheck.push(['CASTLE-KING'])
    }
    if (canCastleQueenSide(occupancy, history, colour,board)) {
        movesNoCheck.push(['CASTLE-QUEEN'])
    }
    return movesNoCheck
}

export function getMovesUCI(board,colour,history){
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    let oppColour = (colour == 'W') ? 'B' : 'W'
    let PIECES = board.get(colour + 'P') | board.get(colour + 'N') | board.get(colour + 'B') | board.get(colour + 'R') | board.get(colour + 'Q') | board.get(colour + 'K')
    let moves = getPieceMoves(board.get(colour + 'K'), occupancy, PIECES, (x, y) => kingMovesActual(y, getAttackBoard(oppColour, board, true), PIECES), "K")
        .concat(getPieceMoves(board.get(colour + 'Q'), occupancy, PIECES, queenMoves, "Q"))
        .concat(getPieceMoves(board.get(colour + 'N'), occupancy, PIECES, (x, y) => knightMoves(y), "N"))
        .concat(getPieceMoves(board.get(colour + 'B'), occupancy, PIECES, bishopMoves, 'B'))
        .concat(getPieceMoves(board.get(colour + 'R'), occupancy, PIECES, rookMoves, "R"))
    let pawns = getPawnMoves(board, colour, history)
    let movesFin = []
    for (let i in moves) {
        movesFin = movesFin.concat(convertMovesToList(moves[i][0], moves[i][1], moves[i][2]))
    }
    //need to set capture before finding no check moves in case scenario where capture to get out of check
    let movesWithCapture = findCaptures(movesFin.concat(pawns), board, colour)
    let movesNoCheck = findNoCheckMoves(movesWithCapture, board, colour)
    if (canCastleKingSide(occupancy, history, colour,board)) {
        movesNoCheck.push(['CASTLE-KING'])
    }
    if (canCastleQueenSide(occupancy, history, colour,board)) {
        movesNoCheck.push(['CASTLE-QUEEN'])
    }
    let finalMoves = []
    for (let move of movesNoCheck){
        finalMoves.push(util.convertMoveToUCI(move,colour))
    }
    return finalMoves  
}

export function findCaptures(moves, board, colour) {
    let newMoves = []
    moves.forEach(move => {
        let piece = move[2]

        //look through all other bitmaps to see if overlap, if so set to 0
        for (let key of board.keys()) {
            if (key == colour + piece) {
                continue
            }
            var bitSet = board.get(key)
            for (let index = 0; index < 64; index++) {
                if (bsutil.get(bitSet, index) == 1 && index == move[1]) {
                    move[4] = 'C' + key[1]
                    break;
                }
            }
        }
        newMoves.push(move)
    })
    return newMoves
}

export function findNoCheckMoves(moves, board: Map<string, bigint>, colour: string) {
    let movesNoCheck = []
    for (var move in moves) {
        let boardState = game.makeMoveUCI(util.convertMoveToUCI(moves[move],colour), board,colour)
        let c = check.isCheck(colour, boardState)
        if (!c) {
            movesNoCheck.push(moves[move])
        }
    }
    return movesNoCheck
}


//gets all squares where colour can attack
export function getAttackBoard(colour: string, board: Map<string, bigint>, forKing: boolean) {
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)

    let oppColour = (colour == 'W') ? 'B' : 'W'
    occupancy = (forKing) ? occupancy &= BigInt(bsutil.not(board.get(oppColour + 'K'))) : occupancy

    let PIECES = 0n;//board.get(colour + 'P') | board.get(colour + 'N') | board.get(colour + 'B') | board.get(colour + 'R') | board.get(colour + 'Q') | board.get(colour + 'K')
    let moves = getPieceMoves(board.get(colour + 'K'), occupancy, PIECES, (x, y) => kingMoves(y), "K")
        .concat(getPieceMoves(board.get(colour + 'Q'), occupancy, PIECES, queenMoves, "Q"))
        .concat(getPieceMoves(board.get(colour + 'N'), occupancy, PIECES, (x, y) => knightMoves(y), "N"))
        .concat(getPieceMoves(board.get(colour + 'B'), occupancy, PIECES, bishopMoves, 'B'))
        .concat(getPieceMoves(board.get(colour + 'R'), occupancy, PIECES, rookMoves, "R"))
        .concat(pawnAttacks(board.get(colour + 'P'), colour))
    moves = moves.map(x => x[0])
    return reduce(moves, (x, y) => { return x | y }, 0n)
}


export function canCastleKingSide(occ: bigint, history, colour: string,board) {
    let rookPos = (colour == 'W') ? 7 : 63;
    let oppColour = (colour == 'W') ? 'B' : 'W'

    let toMove = (colour == 'W') ? bsutil.setRange(0n, 5, 6, 1) : bsutil.setRange(0n, 61, 62, 1)
    let kingPos = (colour == 'W') ? 4 : 60;
    if (!(bsutil.get(occ, kingPos) && bsutil.get(occ, rookPos))) {
        return false
    }
    history = history.map(x => {
        if (x[2] == 'K') { //if king as moved
            return false
        }
        if (x[0] == rookPos && x[2] == 'R') { //if rook has moved
            return false
        }
    })

    if (history.includes(false)) {
        return false
    }
    if ((occ & toMove) > 0) { //if any pieces between
        return false
    }
    
    if((getAttackBoard(oppColour,board,false) & toMove) > 0){
        return false
    }
    return true
}
export function canCastleQueenSide(occ: bigint, history, colour: string,board) {
    let rookPos = (colour == 'W') ? 0 : 56;
    let kingPos = (colour == 'W') ? 4 : 60;
    let oppColour = (colour == 'W') ? 'B' : 'W'

    if (!(bsutil.get(occ, kingPos) && bsutil.get(occ, rookPos))) {
        return false
    }
    let toMove = (colour == 'W') ? bsutil.setRange(0n, 1, 3, 1) : bsutil.setRange(0n, 57, 59, 1)
    history = history.map(x => {
        if (x[2] == 'K') { //if king as moved
            return false
        }
        if (x[0] == rookPos && x[2] == 'R') { //if rook has moved
            return false
        }
    })
    if (history.includes(false)) {
        return false
    }
    if ((occ & toMove) > 0) {
        return false
    }
    if((getAttackBoard(oppColour,board,false) & toMove) > 0){
        return false
    }
    return true
}