import {BitSet} from "./bitset";
import * as utils from './utils'
import * as constants from './constants'
import * as bsutil from './bitSetUtils'
import * as R from "ramda";



export function pawnPossibilities (board,colour,history) {
    var BOARD_STATE = 0
    BOARD_STATE = R.reduce(function(x, y) {return x | y}, BOARD_STATE, Array.from(board.values))
    var possibleMoves = []
    var OFF_LIMIT_PIECES;
    var OPPOSING_PIECES
    var EMPTY;
    var shiftFunction;
    var lastRank;
    var leftSide;
    var rightSide;
    var twoForward;
    var operator;
    var piecesToMove;

    if(colour == 'W'){
        OFF_LIMIT_PIECES=~(board.get('WP')|board.get('WN')|board.get('WB')|board.get('WR')|board.get('WQ')|board.get('WK')|board.get('BK')); //added *K to avoid illegal capture
        OPPOSING_PIECES=(board.get('BP')|(board.get('BN'))|(board.get('BB'))|(board.get('BR'))|(board.get('BQ'))); //omitted *K to avoid illegal capture
        EMPTY=board.get('WP')|(board.get('WN'))|(board.get('WB'))|(board.get('WR'))|(board.get('WQ'))|(board.get('WK'))|(board.get('BP'))|(board.get('BN'))|(board.get('BB'))|(board.get('BR'))|(board.get('BQ'))|(~board.get('BK'));
        shiftFunction = function(x,y) {return x >> y}
        lastRank = constants.RANK_8;
        leftSide = constants.FILE_A;
        rightSide = constants.FILE_H;
        twoForward = constants.RANK_4;
        operator = function (a,b) { return a - b}
        var enpassant = function(a,b) {return a + b}
        piecesToMove = board.get("WP");
    }
    else{
        OFF_LIMIT_PIECES=~(board.get("BP")|board.get("BN")|board.get("BB")|board.get("BR")|board.get("BQ")|board.get("BK")|board.get("WK")); 
        OPPOSING_PIECES=board.get('WP')|board.get('WN')|board.get('WB')|board.get('WR')|board.get('WQ'); 
        EMPTY=board.get('BP')|board.get('BN')|board.get('BB')|board.get('BR')|board.get('BQ')|board.get('BK')|board.get('WP')|board.get('WN')|board.get('WB')|board.get('WR')|board.get('WQ')|~board.get('WK');
        shiftFunction = function(x,y) {return x << y}
        lastRank = constants.RANK_1;
        leftSide = constants.FILE_H;
        rightSide = constants.FILE_A;
        twoForward = constants.RANK_5;
        operator = function (a,b) {return a + b}
        enpassant = function(a,b) {return a - b}
        piecesToMove = board.get('BP');
    }

    //check for en passant
    let lastMove = history[history.length - 1]
    if(lastMove != null && (lastMove[2] == 'P') && Math.abs(lastMove[1] - lastMove[0]) == 16){ //if last move was a pawn moving two squares
        if(piecesToMove.array[lastMove[1] + 1] == 1){ //to the right if white, to the left if black
            possibleMoves.push([lastMove[1] + 1, enpassant(lastMove[1],8), 'P','EN'])
        }
        else if(piecesToMove.array[lastMove[1] - 1] == 1){
            possibleMoves.push([lastMove[1] - 1, enpassant(lastMove[1],8), 'P','EN'])
        }
    }
    //capture right

    var PAWN_MOVES=shiftFunction(piecesToMove,7n)&(OPPOSING_PIECES)&(~lastRank)&(~rightSide);
    var f1 = function (num) {return (operator(num,7))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'N')) 

    //1 forward
    PAWN_MOVES=(shiftFunction(piecesToMove,8n)&(EMPTY)&(~lastRank));
    var f1 = function (num) {return (operator(num,8))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'N'))

    //capture left
    PAWN_MOVES=shiftFunction(piecesToMove,7n)&(OPPOSING_PIECES)&(~lastRank)&(~leftSide);
    var f1 = function (num) {return (operator(num,7))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'N'))

    //move 2 forward
    PAWN_MOVES=(shiftFunction(piecesToMove,16n)&(EMPTY)&(shiftFunction(EMPTY,8n))&(twoForward));
    var f1 = function (num) {return (operator(num,16))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'N'))

    //promotion type 'P'
    //pawn promotion by capture right
    PAWN_MOVES=(shiftFunction(piecesToMove,7n)&(OPPOSING_PIECES)&(lastRank)&(~rightSide));
    var f1 = function (num) {return (operator(num,7))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'P'))

    //pawn promotion by move 1 forward
    PAWN_MOVES=(shiftFunction(piecesToMove,8n)&(EMPTY)&(lastRank))
    var f1 = function (num) {return (operator(num,8))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'P'))

    //pawn promotion by capture left
    PAWN_MOVES=(shiftFunction(piecesToMove,9n)&(OPPOSING_PIECES)&(lastRank)&(~leftSide))
    var f1 = function (num) {return (operator(num,9))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'P'))
    console.log(possibleMoves)

    return possibleMoves
}

export function rookMoves(board){
//     var BOARD_STATE = 0n
//    // BOARD_STATE = R.reduce(utils|, BOARD_STATE, Array.from(board.values()))
//     var rooks = board.get("WR");
//     var firstRook = rooks.lsb();
//     var rank = constants.rankMasks[Math.floor(firstRook / 8)]
//     var file = constants.fileMasks[Math.floor(firstRook % 8)]
//     var occupied = rank&(BOARD_STATE)
//     var slider = new BitSet()
//     slider.set(firstRook, 1);
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
    // lineAttacks=(((o&m)-2s) ^ ((o&m)'-2s')')&m

}

export function generatePossibleMoves(bitSet,f1,f2, piece,moveType) {
    var possibleMoves = []
    let pos = 0
    for(let index = 0; index < 64; index++) {
        let el = bsutil.get(bitSet, index)
        if(el == 1){
            var start = f1(index) 
            var end = f2(index)
            possibleMoves.push([start,end,piece,moveType])
        }
    }
 
    return possibleMoves;
}