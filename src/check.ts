import * as mp from './moves'
import * as bsutil from './bitSetUtils'
export function isCheck(king,attack){
    return ((king & attack) > 0n) ? true : false
}

export function isCheckMate(isCheck:boolean,king:number,occ:bigint,attack:bigint){
    let kingMoves = mp.kingMovesActual(occ,king,attack)
    return (isCheck && kingMoves == 0n) ? true : false
}