import {makeMoveUCI} from './game'
import {arrayEquals} from './util'
import {getMovesUCI,getAttackBoard} from './moves'

export function isCheck(colour,board){//should this take a specific board and the attack board? 
    let king = board.get(colour+'K')
    let oppColour = (colour == 'W') ? 'B' : 'W'
    let attack = getAttackBoard(oppColour,board,true)
    return ((king & attack) > 0n) ? true : false
}

export function isCheckMate(colour,board,history){
    let check = isCheck(colour,board)
    let legalMoves = getMovesUCI(board,colour,history)
    while (check && legalMoves.length > 0) {
        let rand = Math.floor(Math.random() * legalMoves.length)
        let move = legalMoves[rand]
        let boardState = makeMoveUCI(move,board,colour)
        if (!isCheck(colour, boardState)) {
            check = false
        }
        else { //remove move from list
            legalMoves = legalMoves.filter((x) => { if (!arrayEquals(x, move)) return x })
        }
    }
    if(legalMoves.length == 0 && check == true){
        return 1
    }
    if(legalMoves.length == 0 && check == false){
        return 2
    }
    else{
        return 0
    }
}