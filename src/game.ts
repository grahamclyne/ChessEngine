
import * as mp from './moves'
import * as utils from './utils'
import * as bsutil from './bitSetUtils'
import * as check from './check'
import * as R from 'ramda'

export function pickMove(colour, history, board) {
    let moves = mp.getMoves(board, colour, history)
    let rand = Math.floor(Math.random() * moves.length)
    var move = moves[rand]
    //does move put own king in check? 
    //is this player in check? 
    if (move == undefined) {
        throw new Error("No valid moves to choose from");
    }
    return move
}

//function w side effect!!
export function checkCapture(move, board, colour) {
    if (move[3] == 'EN') {
        if (colour == 'W') {
            board.get('BP').set(move[1] - 8, 0)
        }
        else {
            board.get('WP').set(move[1] + 8, 0)
        }
        return
    }
    //look through all other bitmaps to see if overlap, if so set to 0
    for (let key of board.keys()) {
        var bitSet = board.get(key)
        for (let index = 0; index < 64; index++) {
            if (bsutil.get(bitSet, index) == 1 && index == move[1]) {
                console.log("PIECE CAPTURED")
                board.set(key, bsutil.set(board.get(key), index, 0))
            }
        }
    }
}

//function w side effect!!!
export function makeMove(move, piece, colour, board) {
    //let result = eval(ts.transpile(colour + piece))
    checkCapture(move, board, colour)
    board.set(colour + piece, bsutil.set(board.get(colour + piece), move[0], 0))
    board.set(colour + piece, bsutil.set(board.get(colour + piece), move[1], 1))
}

export function play(board, moveHistory) {
    while (true) {
        //WHITE TURN
        console.log("WHITE MOVE:");
        let colour = 'W'
        let move = pickMove(colour, moveHistory, board)
        moveHistory.push(move)
        makeMove(move, move[2], colour, board)
        let checkScenario = checkForMate(colour, board)
        if(checkScenario == 2){
            break
        }
        utils.prettyPrintBoard(board)

        //BLACK TURN
        console.log("BLACK MOVE:");
        colour = "B"
        move = pickMove(colour, moveHistory, board)
        moveHistory.push(move)
        makeMove(move, move[2], colour, board)
        checkScenario = checkForMate(colour, board)
        if(checkScenario == 2){
            break
        }
        utils.prettyPrintBoard(board)

        console.log('\n')
    }
}

export function checkForMate(colour, board) {
    let attack = mp.getAttackBoard(colour, board, true)
    let king = (colour == 'W') ? board.get('BK') : board.get('WK') //get other sides king
    let checked = check.isCheck(king, attack)
    let occ = R.reduce((x, y) => { return x | y }, 0n, Array.from(board.values()))
    let checkmate = check.isCheckMate(checked, bsutil.lsb(king), occ, attack)
    if(checkmate){
        return 2
    }
    else if(checked){
        return 1
    }
    return 0
}
export function handleMoveType(move) {
    if (move == 'N') {//normal
        return;
    }
    else if (move == 'P') {//pawn promotion

    }
    else if (move == 'EN') { //en passant

    }
    else if (move == 'C') {//castle
    }
}

export function checkWinConditions(board) {
    //no pieces
    //checkmate
    //stalemate
    //3 moves in a row
    //50 moves no capture
}

