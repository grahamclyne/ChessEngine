import * as mp from './moves'
import * as bsutil from './bitSetUtils'


export function isCheck(colour,board){//should this take a specific board and the attack board? 
    let king = board.get(colour+'K')
    let oppColour = (colour == 'W') ? 'B' : 'W'
    let attack = mp.getAttackBoard(oppColour,board,true)
    return ((king & attack) > 0n) ? true : false
}

export function isCheckMate(colour,board){
    let pieces = board.get(colour + 'P') | board.get(colour + 'N') | board.get(colour + 'B') | board.get(colour + 'R') | board.get(colour + 'Q') | board.get(colour + 'K')
    let oppColour = (colour == 'W') ? 'B' : 'W'
    let attack = mp.getAttackBoard(oppColour,board,true)
    let king = board.get(colour + 'K')
    let kingCheck = isCheck(colour,board)
    let kingMoves = mp.kingMovesActual(bsutil.lsb(king),attack,pieces)
    return (kingCheck && kingMoves == 0n) ? true : false
}