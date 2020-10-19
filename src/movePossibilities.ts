import {BitSet} from "./bitset";
import * as utils from './utils'
import * as constants from './constants'

import * as R from "ramda";



export function pawnPossibilities (board,colour,history) {
    var BOARD_STATE = new BitSet()
    BOARD_STATE = R.reduce(utils.or, BOARD_STATE, Array.from(board.values()))
    console.log("BOARD_STATE")
    BOARD_STATE.print()
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
        OFF_LIMIT_PIECES=(board.get('WP').or(board.get('WN')).or(board.get('WB')).or(board.get('WR')).or(board.get('WQ')).or(board.get('WK')).or((board.get('BK')).not())); //added *K to avoid illegal capture
        OPPOSING_PIECES=(board.get('BP').or(board.get('BN')).or(board.get('BB')).or(board.get('BR')).or(board.get('BQ'))); //omitted *K to avoid illegal capture
        EMPTY=board.get('WP').or(board.get('WN')).or(board.get('WB')).or(board.get('WR')).or(board.get('WQ')).or(board.get('WK')).or(board.get('BP')).or(board.get('BN')).or(board.get('BB')).or(board.get('BR')).or(board.get('BQ')).or(board.get('BK')).not();
        shiftFunction = utils.rightShift;
        lastRank = constants.RANK_8;
        leftSide = constants.FILE_A;
        rightSide = constants.FILE_H;
        twoForward = constants.RANK_4;
        operator = function (a,b) { return a - b}
        var enpassant = function(a,b) {return a + b}
        piecesToMove = board.get("WP");
    }
    else{
        OFF_LIMIT_PIECES=(board.get("BP").or(board.get("BN")).or(board.get("BB")).or(board.get("BR")).or(board.get("BQ")).or(board.get("BK")).or((board.get("WK")).not())); 
        OPPOSING_PIECES=(board.get('WP').or(board.get('WN')).or(board.get('WB')).or(board.get('WR')).or(board.get('WQ'))); 
        EMPTY=board.get('BP').or(board.get('BN')).or(board.get('BB')).or(board.get('BR')).or(board.get('BQ')).or(board.get('BK')).or(board.get('WP')).or(board.get('WN')).or(board.get('WB')).or(board.get('WR')).or(board.get('WQ')).or(board.get('WK')).not();
        shiftFunction = utils.leftShift;
        lastRank = constants.RANK_1;
        leftSide = constants.FILE_H;
        rightSide = constants.FILE_A;
        twoForward = constants.RANK_5;
        operator = function (a,b) {return a + b}
        enpassant = function(a,b) {return a - b}
        piecesToMove = board.get('BP');
    }

    //check for en passant
    var lastMove = history[history.length - 1]
    if(lastMove != null && (lastMove[2] == 'P') && Math.abs(lastMove[1] - lastMove[0]) == 16){ //if last move was a pawn moving two squares
        if(piecesToMove.array[lastMove[1] + 1] == 1){ //to the right if white, to the left if black
            possibleMoves.push([lastMove[1] + 1, enpassant(lastMove[1],8), 'P','EN'])
        }
        else if(piecesToMove.array[lastMove[1] - 1] == 1){
            possibleMoves.push([lastMove[1] - 1, enpassant(lastMove[1],8), 'P','EN'])
        }
    }
    //capture right
    var PAWN_MOVES=(shiftFunction(piecesToMove,7).and(OPPOSING_PIECES).and(lastRank.not()).and(rightSide.not()));
    var f1 = function (num) {return (operator(num,7))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'N')) 

    //1 forward
    PAWN_MOVES=(shiftFunction(piecesToMove,8).and(EMPTY).and((lastRank).not()));
    var f1 = function (num) {return (operator(num,8))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'N'))

    //capture left
    PAWN_MOVES=(shiftFunction(piecesToMove,7).and(OPPOSING_PIECES).and(lastRank.not()).and(leftSide.not()));
    var f1 = function (num) {return (operator(num,7))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'N'))

    //move 2 forward
    PAWN_MOVES=(shiftFunction(piecesToMove,16).and(EMPTY).and(shiftFunction(EMPTY,8)).and(twoForward));
    var f1 = function (num) {return (operator(num,16))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'N'))

    //promotion type 'P'
    //pawn promotion by capture right
    PAWN_MOVES=(shiftFunction(piecesToMove,7).and(OPPOSING_PIECES).and(lastRank).and(rightSide.not()));
    var f1 = function (num) {return (operator(num,7))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'P'))

    //pawn promotion by move 1 forward
    PAWN_MOVES=(shiftFunction(piecesToMove,8).and(EMPTY).and(lastRank))
    var f1 = function (num) {return (operator(num,8))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'P'))

    //pawn promotion by capture left
    PAWN_MOVES=(shiftFunction(piecesToMove,9).and(OPPOSING_PIECES).and(lastRank).and(leftSide.not()))
    var f1 = function (num) {return (operator(num,9))}
    var f2 = function (num) {return (num)}
    possibleMoves = possibleMoves.concat(generatePossibleMoves(PAWN_MOVES,f1,f2, 'P', 'P'))
    console.log(possibleMoves)


    var ROOK_MOVES=createEmptyStatement

    return possibleMoves
}

export function generatePossibleMoves(bitSet,f1,f2, piece,moveType) {
    var possibleMoves = []
    bitSet.array.map(function(el,index){
        if(el == 1){
            var start = f1(index) 
            var end = f2(index)
            possibleMoves.push([start,end,piece,moveType])
        }
    })
 
    return possibleMoves;
}