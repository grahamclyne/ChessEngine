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
     //   OFF_LIMIT_PIECES = bsutil.not((board.get('WP') | board.get('WN') | board.get('WB') | board.get('WR') | board.get('WQ') | board.get('WK') | board.get('BK')); //added *K to avoid illegal capture
        OPPOSING_PIECES = (board.get('BP') | (board.get('BN')) | (board.get('BB')) | (board.get('BR')) | (board.get('BQ'))); //omitted *K to avoid illegal capture
        EMPTY = bsutil.not(board.get('WP') | (board.get('WN')) | (board.get('WB')) | (board.get('WR')) | (board.get('WQ')) | (board.get('WK')) | (board.get('BP')) | (board.get('BN')) | (board.get('BB')) | (board.get('BR')) | (board.get('BQ')) | board.get('BK'));
        shiftFunction = function (x, y) { return x << y }
        lastRank = constants.RANK_8;
        leftSide = constants.FILE_A;
        rightSide = constants.FILE_H;
        twoForward = constants.RANK_4;
        operator = function (a, b) { return a - b }
        enpassant = function (a, b) { return a + b }
        piecesToMove = board.get('WP');
    }
    else {
    //    OFF_LIMIT_PIECES = bsutil.not((board.get("BP") | board.get("BN") | board.get("BB") | board.get("BR") | board.get("BQ") | board.get("BK") | board.get("WK"));
        OPPOSING_PIECES = board.get('WP') | board.get('WN') | board.get('WB') | board.get('WR') | board.get('WQ');
        EMPTY = bsutil.not(board.get('BP') | board.get('BN') | board.get('BB') | board.get('BR') | board.get('BQ') | board.get('BK') | board.get('WP') | board.get('WN') | board.get('WB') | board.get('WR') | board.get('WQ') | board.get('WK'));
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
    let PAWN_MOVES = shiftFunction(piecesToMove, 7n) & (OPPOSING_PIECES) & (bsutil.not(lastRank)) & (bsutil.not(rightSide));
    let f1 = function (num) { return (operator(num, 7)) }
    let f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'N'))

    //1 forward
    PAWN_MOVES = shiftFunction(piecesToMove, 8n) & EMPTY & bsutil.not(lastRank);
    f1 = function (num) { return (operator(num, 8)) }
    f2 = function (num) { return (num) }
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES, f1, f2, 'P', 'N'))

    // //capture left
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
    PAWN_MOVES = (shiftFunction(piecesToMove, 7n) & (OPPOSING_PIECES) &lastRank & bsutil.not(rightSide));
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

export function pawnAttacks(pawnBoard,colour){
    let attacks = 0n;
    if(colour == 'W'){
        attacks |= (pawnBoard << 7n) & bsutil.not(constants.FILE_H);
        attacks |= (pawnBoard << 9n) & bsutil.not(constants.FILE_A);
      }
    else{
        attacks |= (pawnBoard >> 7n) & bsutil.not(constants.FILE_A);
        attacks |= (pawnBoard >> 9n) & bsutil.not(constants.FILE_H);
    }
    return [[attacks,0n,"P"]];
}
export function rookMoves(occ, sq) {
    //could use whole occupancy board,but would map to too many possibilties, following line gives us a reduced occupancy that is much more manageable
    //use same magic number while instantiating rook_moves array as for rook_magic_numbers
    let occ1 = occ
    occ &= magic.rMask(sq);
    occ *= magic.rook_magic_numbers[sq];
    //  occ *= magic.findMagic(sq,utils.nRBits[sq],0)
    occ >>= (64n - BigInt(magic.nRBits[Number(sq)]))
    return magic.rookAttacksOnTheFly(occ1, sq)
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
    if ((bitboard >> 17n) & bsutil.not(constants.FILE_H)) attacks |= (bitboard >> 17n);
    if ((bitboard >> 15n) & bsutil.not(constants.FILE_A)) attacks |= (bitboard >> 15n);
    if ((bitboard >> 10n) & bsutil.not(constants.FILE_H) & bsutil.not(constants.FILE_G)) attacks |= (bitboard >> 10n);
    if ((bitboard >> 6n) & bsutil.not(constants.FILE_A) & bsutil.not(constants.FILE_B)) attacks |= (bitboard >> 6n);
    if ((bitboard << 17n) & bsutil.not(constants.FILE_A)) attacks |= (bitboard << 17n);
    if ((bitboard << 15n) & bsutil.not(constants.FILE_H)) attacks |= (bitboard << 15n);
    if ((bitboard << 10n) & bsutil.not(constants.FILE_A) & bsutil.not(constants.FILE_B)) attacks |= (bitboard << 10n);
    if ((bitboard << 6n) & bsutil.not(constants.FILE_H) & bsutil.not(constants.FILE_G)) attacks |= (bitboard << 6n);
    attacks = BigInt.asUintN(64, BigInt(attacks))
    return attacks
}

export function queenMoves(occ, sq) {
    // occ &= rMask(sq);
    // occ *= utils.magicR[sq];
    // occ >>= (64n - BigInt(utils.nRBits[sq]))
    return magic.bishopAttacksOnTheFly(occ, sq) | magic.rookAttacksOnTheFly(occ, sq)
}

export function kingMoves(occ, sq) {
    let attacks = 0n;
    let bitboard = bsutil.set(0n, sq, 1)
    //the not constants.FILE_H is to stop wraparound!!!
    if ((bitboard >> 1n) & bsutil.not(constants.FILE_H)) attacks |= (bitboard >> 1n);
    if ((bitboard >> 7n) & bsutil.not(constants.FILE_A)) attacks |= (bitboard >> 7n);
    attacks |= (bitboard >> 8n);
    if ((bitboard >> 9n) & bsutil.not(constants.FILE_H)) attacks |= (bitboard >> 9n);
    if ((bitboard << 1n) & bsutil.not(constants.FILE_A)) attacks |= (bitboard << 1n);
    if ((bitboard << 7n) & bsutil.not(constants.FILE_H)) attacks |= (bitboard << 7n);
    attacks |= (bitboard << 8n);
    if ((bitboard << 9n) & bsutil.not(constants.FILE_A)) attacks |= (bitboard << 9n);
    attacks = BigInt.asUintN(64, BigInt(attacks)) //truncate... this probably slowing things down? 
    return attacks
}
export function kingMovesActual(occ,sq,attackBoard){
    return kingMoves(occ,sq)&(bsutil.not(attackBoard))
}


export function getPieceMoves(bitBoard, occ, pieces, f,pieceName){
    if(bitBoard == 0n){ //none of these pieces exist
        return []
    }
    let piece1 = BigInt(bsutil.msb(bitBoard))
    let piece2 = BigInt(bsutil.lsb(bitBoard))
    if(piece1 == piece2){
        return [[f(occ,piece1)&BigInt(bsutil.not(pieces)),piece1,pieceName]]
    }
    else{
        return [[f(occ,piece1)&BigInt(bsutil.not(pieces)),piece1,pieceName],
       [f(occ,piece2)&BigInt(bsutil.not(pieces)),piece2,pieceName]]
    }
}

export function convertMovesToList(board, piece,pieceName){
    return generatePossibleMoves(board, (x) =>Number(piece), x => Number(x), pieceName, "N")
}
export function getMoves(board, colour, history) {
    let occupancy = R.reduce((x, y) => { return x | y }, 0n, Array.from(board.values()));
    let moves = []
    let pawns = []
    if (colour == 'W') {
        let WHITE_PIECES = board.get('WP') | board.get('WN') | board.get('WB') | board.get('WR') | board.get('WQ') | board.get('WK')
        moves = getPieceMoves(board.get("WK"), occupancy,WHITE_PIECES,(x,y) => kingMovesActual(x,y,getAttackBoard('B', board,true)),"K")
        .concat(getPieceMoves(board.get("WQ"), occupancy,WHITE_PIECES,queenMoves,"Q"))
        .concat(getPieceMoves(board.get("WN"), occupancy,WHITE_PIECES,knightMoves,"N"))
        .concat(getPieceMoves(board.get("WB"), occupancy,WHITE_PIECES,bishopMoves,'B'))
        .concat(getPieceMoves(board.get("WR"), occupancy,WHITE_PIECES,rookMoves,"R"))
        pawns = getPawnMoves(board, "W", history)
    }
    else {
        let BLACK_PIECES = (board.get('BP') | (board.get('BN')) | (board.get('BB')) | (board.get('BR')) | (board.get('BQ') | board.get('BK'))); 
        moves = getPieceMoves(board.get("BK"), occupancy,BLACK_PIECES,(x,y) => kingMovesActual(x,y,getAttackBoard('W', board,true)),"K")
        .concat(getPieceMoves(board.get("BQ"), occupancy,BLACK_PIECES,queenMoves,"Q"))
        .concat(getPieceMoves(board.get("BN"), occupancy,BLACK_PIECES,knightMoves,"N"))
        .concat(getPieceMoves(board.get("BB"), occupancy,BLACK_PIECES,bishopMoves,"B"))
        .concat(getPieceMoves(board.get("BR"), occupancy,BLACK_PIECES,rookMoves,"R"))
        pawns = getPawnMoves(board, "B", history)    
    }
    let movesFin = []
    for (let i in moves){
        movesFin = movesFin.concat(convertMovesToList(moves[i][0],moves[i][1],moves[i][2]))
    }
    return movesFin.concat(pawns)
}

export function getAttackBoard(colour:string,board:Map<string,bigint>,forKing:boolean){
    let occupancy = R.reduce((x, y) => { return x | y }, 0n, Array.from(board.values()))
    let moves = [];
    if(colour == 'W'){
        if(forKing){
            occupancy = R.reduce((x, y) => { return x | y }, 0n, Array.from(board.values())) & BigInt(bsutil.not(board.get('BK')))
        }
        else{
            occupancy = R.reduce((x, y) => { return x | y }, 0n, Array.from(board.values()))
        }
        let WHITE_PIECES = board.get('WP') | board.get('WN') | board.get('WB') | board.get('WR') | board.get('WQ') | board.get('WK')
        moves = getPieceMoves(board.get("WK"), occupancy,WHITE_PIECES,kingMoves,"K")
        .concat(getPieceMoves(board.get("WQ"), occupancy,WHITE_PIECES,queenMoves,"Q"))
        .concat(getPieceMoves(board.get("WN"), occupancy,WHITE_PIECES,knightMoves,"N"))
        .concat(getPieceMoves(board.get("WB"), occupancy,WHITE_PIECES,bishopMoves,'B'))
        .concat(getPieceMoves(board.get("WR"), occupancy,WHITE_PIECES,rookMoves,"R"))
        .concat(pawnAttacks(board.get("WP"),'W'))
    }
    else {
        if(forKing){
            occupancy = R.reduce((x, y) => { return x | y }, 0n, Array.from(board.values())) & BigInt(bsutil.not(board.get('WK')))
        }
        else{
            occupancy = R.reduce((x, y) => { return x | y }, 0n, Array.from(board.values()))
        }
        let BLACK_PIECES = (board.get('BP') | (board.get('BN')) | (board.get('BB')) | (board.get('BR')) | (board.get('BQ') | board.get('BK'))); 
        moves = getPieceMoves(board.get("BK"), occupancy,BLACK_PIECES,kingMoves,"K")
        .concat(getPieceMoves(board.get("BQ"), occupancy,BLACK_PIECES,queenMoves,"Q"))
        .concat(getPieceMoves(board.get("BN"), occupancy,BLACK_PIECES,knightMoves,"N"))
        .concat(getPieceMoves(board.get("BB"), occupancy,BLACK_PIECES,bishopMoves,"B"))
        .concat(getPieceMoves(board.get("BR"), occupancy,BLACK_PIECES,rookMoves,"R"))
        .concat(pawnAttacks(board.get("BP"), 'B'))
    }
    moves = moves.map(x => x[0])
    console.log(moves)
    let attackBoard = R.reduce((x,y) => {return x | y},0n, moves)
    console.log(attackBoard)
    return attackBoard
}


export function canCastleKingSide(){

}
export function canCastleQueenSide(){
    
}