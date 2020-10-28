
import * as moves from './moves'
import * as utils from './utils'
import * as bsutil from './bitSetUtils'
import * as check from './check'
import { reduce, filter } from 'lodash'
import * as readline from 'readline';


var CHECK_FLAG = false

import { Logger } from "tslog";
const log: Logger = new Logger({ name: "myLogger" });

export function findMoves(colour: string, history, board: Map<string, bigint>) {
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)

    let legalMoves = moves.getMoves(board, colour, history)
    if (moves.canCastleKingSide(occupancy, history, colour)) {
        legalMoves.push(['CASTLE-KING'])
    }
    if (moves.canCastleQueenSide(occupancy, history, colour)) {
        legalMoves.push(['CASTLE-QUEEN'])
    }
    return legalMoves
}

//side effect with move inputted
export function checkCapture(move, board, colour, piece) {
    let out = utils.deepCloneMap(board)
    if (move[3] == 'EN') {
        if (colour == 'W') {
            out.set(colour + 'P', bsutil.set(out.get(colour + 'P'), move[1] - 8, 0))
        }
        else {
            out.set(colour + 'P', bsutil.set(out.get(colour + 'P'), move[1] + 8, 0))
        }
        return out
    }
    //look through all other bitmaps to see if overlap, if so set to 0
    for (let key of board.keys()) {
        if(key == colour + piece){
            continue
        }
        var bitSet = board.get(key)
        for (let index = 0; index < 64; index++) {
            if (bsutil.get(bitSet, index) == 1 && index == move[1]) {
                out.set(key, bsutil.set(out.get(key), index, 0))
                move[3] = 'C'
                break;
            }
        }
    }
    return out
}

export function makeMove(move, colour: string, board: Map<string, bigint>) {
    let out = utils.deepCloneMap(board)
    let squares = []
    let piece = move[2]
    if (piece != null) {//ie, not a castle
        out = checkCapture(move, board, colour, piece)
        out.set(colour + piece, bsutil.set(out.get(colour + piece), move[0], 0))
        out.set(colour + piece, bsutil.set(out.get(colour + piece), move[1], 1))
        if (move[3] == 'P') {
            out = promotePawn(move[1], out, colour)
        }
        return out
    }
    else if (move == 'CASTLE-KING') {
        squares = (colour == 'W') ? [6, 4, 5, 7] : [62, 60, 61, 63]
    }
    else if (move == 'CASTLE-QUEEN') {
        squares = (colour == 'W') ? [2, 4, 3, 0] : [58, 60, 59, 56]
    }
    out.set(colour + 'K', bsutil.set(out.get(colour + 'K'), squares[1], 0))
    out.set(colour + 'K', bsutil.set(out.get(colour + 'K'), squares[0], 1))
    out.set(colour + 'R', bsutil.set(out.get(colour + 'R'), squares[3], 0))
    out.set(colour + 'R', bsutil.set(out.get(colour + 'R'), squares[2], 1))
    utils.prettyPrintBoard(out)
    return out
}




export async function play(board, history, opponent) {
    let colour = 'W'
    let states = []
    let mate = 0
    let sameMove = false
    let fifty = false

    while (mate != 2 && sameMove == false && fifty == false) {
        board = takeTurn(board, history, colour, states)
        colour = (colour == 'W') ? 'B' : 'W'
        mate = checkForMate(colour, board)
        sameMove = sameMoveCheck(states)
        fifty = fiftyMoves(history)

        log.info('game over conditions: mate:', mate, ',sameMove: ', sameMove, ' fifty: ', fifty)
        if (opponent == 'HUMAN') {
            let move = await parseInput()
            board = makeMove(move,colour,board)
            while(!isValidMove(move,board,colour)){
                let move = await parseInput()
            }
            history.push(move)
            colour = (colour == 'W') ? 'B' : 'W'
            log.info("PLAYER MOVE: ", move)
            utils.prettyPrintBoard(board)
        }
    }
}

export function isValidMove(move,board,colour) {
    let pieceBoard = board.get(colour + move[2])
    if(!bsutil.get(pieceBoard,move[0])){
        log.error(move[2] + 'does not exist on that square')
        return false
    }
    return true
}





//move syntax
//[piece][startsquare][endsquare]
//eg. Ke4e5
//Pe4e6
export function parseInput() {

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve,reject) => {
        let pMove = []
        rl.setPrompt('Make your move: ')
        rl.prompt()
        rl.on('line', (move) => {
            if (move.length != 5) {
                log.error('Improper input: need [PNKQBR][startfile][startrow][endfile][endrow]')
                rl.prompt()
            }
            else {
                let pieceName = move[0]
                let startSquare = move.slice(1, 3)
                let endSquare = move.slice(3, 5)
                parseInputSquare(startSquare)
                parseInputSquare(endSquare)
                pMove = [parseInputSquare(startSquare), parseInputSquare(endSquare), pieceName, 'N']
                rl.close()
                resolve(pMove)
            }
        })
    })
}

export function parseInputSquare(sq) {
    let row = sq[0]
    let file = sq[1]
    let rows = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 }
    return (rows[row] + ((file - 1) * 8))
}

//function with side effect (on state, and history object)
export function takeTurn(board, history, colour, states) {
    log.info(colour + ' TURN:')
    let legalMoves = findMoves(colour, history, board)
    //remove all moves that put into check position
    let rand = Math.floor(Math.random() * legalMoves.length)
    let move = legalMoves[rand]
    log.info("Move chosen:",move)
    while (CHECK_FLAG) {
        let boardState = makeMove(move, colour, board)
        if (!check.isCheck(colour, boardState)) {
            CHECK_FLAG = false
        }
        else {
            legalMoves = legalMoves.filter((x) => { if (!utils.arrayEquals(x, move)) return x })
        }
        let rand = Math.floor(Math.random() * legalMoves.length)
        move = legalMoves[rand]
        log.info('Move to get out of check', move)
    }

    history.push(move)
    let newBoard = makeMove(move, colour, board)
    let state = reduce( Array.from(newBoard.values()),(x, y) => { return x | y }, 0n)
    states.push(state)
    utils.prettyPrintBoard(newBoard)
    return newBoard
}

export function checkForMate(colour: string, board: Map<string, bigint>) {
    let checked = check.isCheck(colour, board)
    let checkmate = check.isCheckMate(colour, board)
    if (checkmate) {
        return 2
    }
    if (checked) {
        log.info(colour + "put other into Check")
        CHECK_FLAG = true
    }
    return 0
}


//funciton w side effect
export function promotePawn(sq, board, colour) {
    let out = utils.deepCloneMap(board)
    out.set(colour + 'P', bsutil.set(out.get(colour + 'P'), sq, 0))
    out.set(colour + 'Q', bsutil.set(out.get(colour + 'Q'), sq, 1)) // always to a queen
    return out
}

export function sameMoveCheck(states: Array<bigint>) {
    let grouped = reduce(states, (rv, x) => { if (rv.get(x) == undefined) { rv.set(x, 1) } else { rv.set(x, rv.get(x) + 1) }; return rv; }, new Map())
    let filtered = filter(Array.from(grouped), (x) => (x[1] == 5))
    if (filtered.length > 0) {
        return true
    }
    return false
}

//The fifty-move rule in chess states that a player can claim a draw if no capture has been made and no pawn has been moved in the last fifty moves 
//(for this purpose a "move" consists of a player completing their turn followed by the opponent completing their turn)
export function fiftyMoves(history) {
    //get last fifty moves
    if (history.length < 50) {
        return false
    }
    let fifty = history.slice(history.length - 50, history.length)
    //see if any pawn moves
    let pawnMoves = filter(fifty, x => x[2] == 'P')
    if (pawnMoves.length > 0) {
        return false
    }
    //see if any captures
    let captures = filter(fifty, x => x[3] == 'C')
    if (captures.length > 0) {
        return false
    }
    return true
}

