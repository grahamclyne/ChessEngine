
import * as wpp from './movePossibilities'
import * as utils from './utils'
import * as bsutil from './bitSetUtils'


export function pickMove(colour, history, board) {
    var movePossibilities = wpp.pawnPossibilities(board, colour, history)
    let rand = Math.floor(Math.random() * movePossibilities.length)
    var move = movePossibilities[rand]
  //  console.log(move)
    handleMoveType(move[3]) //TODO
    makeMove(move, move[2], colour, board)
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
        for(let index = 0; index < 64; index++) {
            if (bsutil.get(bitSet,index) == 1 && index == move[1]) {
                console.log("PIECE CAPTURED")
                board.set(key,bsutil.set(board.get(key),index, 0))
            }
        }
    }
}

//function w side effect!!!
export function makeMove(move, piece, colour, board) {
    //let result = eval(ts.transpile(colour + piece))
    checkCapture(move, board, colour)
    board.set(colour+piece,bsutil.set(board.get(colour + piece),move[0], 0))
    board.set(colour+piece,bsutil.set(board.get(colour + piece),move[1], 1))
}

export function play(board, moveHistory) {
    var move_count = 0;
    while (move_count < 15) {
        moveHistory.push(pickMove('W', moveHistory, board))
        console.log("WHITE MOVE:");
        utils.prettyPrintBoard(board)
        moveHistory.push(pickMove('B', moveHistory, board))
        console.log("BLACK MOVE:");
        utils.prettyPrintBoard(board)
        move_count++
        console.log('\n')
    }
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

