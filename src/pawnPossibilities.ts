import {BitSet} from "./bitset";
import * as utils from './utils'
import * as constants from './constants'




export function pawnPossibilities (WP : BitSet,WN : BitSet,WB : BitSet,WR : BitSet,WQ : BitSet,WK : BitSet,BP : BitSet,BN : BitSet,BB : BitSet,BR : BitSet,BQ : BitSet,BK : BitSet, colour) {
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
        OFF_LIMIT_PIECES=(WP.or(WN).or(WB).or(WR).or(WQ).or(WK).or((BK).not())); //added *K to avoid illegal capture
        OPPOSING_PIECES=(BP.or(BN).or(BB).or(BR).or(BQ)); //omitted *K to avoid illegal capture
        EMPTY=WP.or(WN).or(WB).or(WR).or(WQ).or(WK).or(BP).or(BN).or(BB).or(BR).or(BQ).or(BK).not();
        shiftFunction = utils.rightShift;
        lastRank = constants.RANK_8;
        leftSide = constants.FILE_A;
        rightSide = constants.FILE_H;
        twoForward = constants.RANK_4;
        operator = function (a,b) { return a - b}
        piecesToMove = WP;
    }
    else{
        OFF_LIMIT_PIECES=(BP.or(BN).or(BB).or(BR).or(BQ).or(BK).or((WK).not())); 
        OPPOSING_PIECES=(WP.or(WN).or(WB).or(WR).or(WQ)); 
        EMPTY=BP.or(BN).or(BB).or(BR).or(BQ).or(BK).or(WP).or(WN).or(WB).or(WR).or(WQ).or(WK).not();
        shiftFunction = utils.leftShift;
        lastRank = constants.RANK_1;
        leftSide = constants.FILE_H;
        rightSide = constants.FILE_A;
        twoForward = constants.RANK_5;
        operator = function (a,b) {return a + b;}
        piecesToMove = BP;
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

    //en passant
    return possibleMoves
}

export function kingPossibilties(WP : BitSet,WN : BitSet,WB : BitSet,WR : BitSet,WQ : BitSet,WK : BitSet,BP : BitSet,BN : BitSet,BB : BitSet,BR : BitSet,BQ : BitSet,BK : BitSet, colour){

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