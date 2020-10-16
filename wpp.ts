import BitSet from "bitset";
import * as utils from './Utils'
import * as constants from './constants'
export function whitePawnPossibilities (WP : BitSet,WN : BitSet,WB : BitSet,WR : BitSet,WQ : BitSet,WK : BitSet,BP : BitSet,BN : BitSet,BB : BitSet,BR : BitSet,BQ : BitSet,BK : BitSet) {
    var possibleMoves = []
    var NOT_WHITE_PIECES=(WP.or(WN).or(WB).or(WR).or(WQ).or(WK).or(BK).not()); //added BK to avoid illegal capture
    var BLACK_PIECES=(BP.or(BN).or(BB).or(BR).or(BQ)); //omitted BK to avoid illegal capture
    var EMPTY=(WP.or(WN).or(WB).or(WR).or(WQ).or(WK).or(BP).or(BN).or(BB).or(BR).or(BQ).or(BK).not());
    
    //capture right
    var PAWN_MOVES=(utils.rightShift(WP,9).and(EMPTY).and(utils.rightShift(EMPTY,8)).and(constants.RANK_4));
    //1 forward
    PAWN_MOVES=(utils.rightShift(WP,8).and(EMPTY).and((constants.RANK_8).not()));
    console.log(PAWN_MOVES.toArray())
    utils.printBitSet(PAWN_MOVES)
    var array = PAWN_MOVES.toArray()
    for (var i in array) {
        var x1 = (array[i] - 8) / 8
        var y1 = (array[i] - 8) % 8
        var x2 = array[i] / 8
        var y2 = array[i] % 8
        possibleMoves.push([x1,y1,x2,y2]) 
    }
    console.log(possibleMoves)
    //capture left
    PAWN_MOVES=(utils.rightShift(WP,7).and(BLACK_PIECES).and(constants.RANK_8.not()).and(constants.FILE_H.not()));
    //move 2 forward
    PAWN_MOVES=(utils.rightShift(WP,16).and(EMPTY).and(utils.rightShift(EMPTY,8).and(constants.RANK_4)));

    // //y1,y2,Promotion Type,"P"
    //pawn promotion by capture right
    PAWN_MOVES=(utils.rightShift(WP,7).and(BLACK_PIECES).and(constants.RANK_8).and(constants.FILE_A.not()));
    //pawn promotion by move 1 forward
    PAWN_MOVES=(utils.rightShift(WP,8).and(EMPTY).and(constants.RANK_8))
    //pawn promotion by capture left
    PAWN_MOVES=(utils.rightShift(WP,9).and(BLACK_PIECES).and(constants.RANK_8).and(constants.FILE_H.not()))

}



export function generatePossibleMoves(bitSet) {

}