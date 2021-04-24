
import * as util from './util'
import * as bsutil from './bitSetUtils'
import * as check from './check'
import { reduce, filter } from 'lodash'
import * as player from './player'
import * as search from './search'

var CHECK_FLAG = false

import { Logger } from "tslog";
const log: Logger = new Logger({ name: "myLogger" });


//=============================  GAME MECHANICS  =============================//
//============================================================================//
//all modifications to board live here




export async function pickMoveUCI(board:Map<string,bigint>, history, colour:string) {
    let root = { board: board, weight: 0, move: [], children: [] }
    let mm =  await search.minimax1alpha(root, 3, colour, -Infinity, Infinity, history)
    let move = []
    mm.children.forEach(child => {
        if (child.weight == mm.weight) {
            move = child.move
        }
    })
    return move
}





export function makeMoveUCI(move, board: Map<string, bigint>, colour:string) {
    let out = util.deepCloneMap(board)
    let letterToNum = {
        'a': 0,
        'b': 1,
        'c': 2,
        'd': 3,
        'e': 4,
        'f': 5,
        'g': 6,
        'h': 7
    }
    let start = letterToNum[move[0]] + ((move[1] - 1) * 8) //starting position of move, converted from A4 notation to bitboard
    let end = letterToNum[move[2]] + ((move[3] - 1) * 8) //ending position of move ''       '''         '''
    if(move.length == 5){ // ie f5f4Q
        //pawn promotion
        out.set(colour + 'P', bsutil.set(out.get(colour + 'P'), end, 0))
        out.set(colour + move[4], bsutil.set(out.get(colour + move[4]), end, 1)) 
    }
    out.forEach((value, key) => {
        //if capture
        let isCapture = false
        for (let capKey of board.keys()) {
            if (key == capKey) {
                continue
            }
            let bitSet = board.get(capKey)
            for (let index = 0; index < 64; index++) {
                if (bsutil.get(bitSet, index) == 1 && index == end) {
                    out.set(capKey, bsutil.set(out.get(capKey), end, 0))
                    isCapture = true
                    break;
                }
            }
        }
        if (bsutil.get(value, start) == 1) {
            //if enpassant
            if (key.includes('P') && isCapture == false && Math.abs(end - start) != 8 && Math.abs(end - start) != 16) {
                if (colour == 'W') {
                    out.set('BP', bsutil.set(out.get('BP'), end - 8, 0))
                }
                else {
                    out.set('WP', bsutil.set(out.get('WP'), end + 8, 0))
                }
            }
            //if castle
            if (key.includes('K')) {
                if (move == 'e1g1') {
                    out.set('WR', bsutil.set(out.get('WR'), 7, 0))
                    out.set('WR', bsutil.set(out.get('WR'), 5, 1))
                }
                else if (move == 'e1c1') {
                    out.set('WR', bsutil.set(out.get('WR'), 0, 0))
                    out.set('WR', bsutil.set(out.get('WR'), 3, 1))
                }
                else if (move == 'e8g8') {
                    out.set('BR', bsutil.set(out.get('BR'), 63, 0))
                    out.set('BR', bsutil.set(out.get('BR'), 61, 1))
                }
                else if (move == 'e8c8') {
                    out.set('BR', bsutil.set(out.get('BR'), 56, 0))
                    out.set('BR', bsutil.set(out.get('BR'), 59, 1))
                }
            }

            out.set(key, bsutil.set(out.get(key), start, 0))
            out.set(key, bsutil.set(out.get(key), end, 1))
        }
    })
    return out
}





export async function play(board: Map<string, bigint>, history, opponent:string) {
    let colour = 'W'
    let states = []
    while (true) {
        let hrstart = process.hrtime()
        board = await takeTurn(board, history, colour, states)
        let hrend = process.hrtime(hrstart)
        log.info('Turn time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
        console.log(board)
        let total = process.memoryUsage().heapTotal
        let used = process.memoryUsage().heapUsed
        log.info("HEAP USAGE: %d" ,used/total)
        colour = (colour == 'W') ? 'B' : 'W'
        if (checkEndGameConditions(board, states, history, colour)) break
        if (opponent == 'HUMAN') {
            let move = null
            while (move == null) {
                move = await player.parseInput(colour, history, board)
            }
            board = makeMoveUCI(move, board,colour)
            history.push(move)
            colour = (colour == 'W') ? 'B' : 'W'
            log.info("PLAYER MOVE: ", move)
            if (checkEndGameConditions(board, states, history, colour)) break
            util.prettyPrintBoard(board)
        }
    }
}





//function with side effect (on state, and history object)
export async function takeTurn(board: Map<string, bigint>, history, colour:string, states:Array<BigInt>) {
    log.info(colour + ' TURN:')
    let move = await pickMoveUCI(board,history,colour)
    log.info("Move chosen:", move)
    history.push(move)
    let newBoard = makeMoveUCI(move, board,colour)
    let state = reduce(Array.from(newBoard.values()), (x, y) => { return x | y }, 0n)
    states.push(state)
    util.prettyPrintBoard(newBoard)
    return newBoard
}




//=============================  END GAME LOGIC  =============================//
//============================================================================//

export function checkEndGameConditions(board: Map<string, bigint>, states: Array<bigint>, history, colour) {
    let oppColour = (colour == 'W') ? 'B' : 'W'
    if (checkForMate(colour, board, history) == 1) {
        log.info('Checkmate')
        return true
    }
    if (checkForMate(colour, board, history) == 2) {
        log.info('Stalemate')
        return true
    }
    if (sameBoardStateFiveTimes(states)) {
        log.info('Same board state 5 times. ')
        return true
    }
    // if (fiftyMoves(history)) {
    //     log.info('fifty moves condition')
    //     return true
    // }
    if (!(hasEnoughMaterial(board, colour) || hasEnoughMaterial(board, oppColour))) {
        log.info('Not enough material, stalemate')
        return true
    }
    return false
}

export function checkForMate(colour: string, board: Map<string, bigint>, history) {
    if (check.isCheck(colour, board)) {
        log.info(colour + " is in Check")
        CHECK_FLAG = true
    }
    return check.isCheckMate(colour, board, history)
}

export function sameBoardStateFiveTimes(states: Array<bigint>) {
    let grouped = reduce(states, (rv, x) => { if (rv.get(x) == undefined) { rv.set(x, 1) } else { rv.set(x, rv.get(x) + 1) }; return rv; }, new Map())
    let filtered = filter(Array.from(grouped), (x) => (x[1] == 5))
    if (filtered.length > 0) {
        return true
    }
    return false
}

//The fifty-move rule in chess states that a player can claim a draw if no capture has been made and no pawn has been moved in the last fifty moves 
//(for this purpose a "move" consists of a player completing their turn followed by the opponent completing their turn)
export function fiftyMoves(history: Array<Array<number | string>>) {
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

export function hasEnoughMaterial(board: Map<string, bigint>, colour: string) {
    if (board.get(colour + 'P') > 0n) {
        return true
    }
    if (board.get(colour + 'N') > 0n && board.get(colour + 'B') > 0n) {
        return true
    }
    if (util.count_1s(board.get(colour + 'B')) == 2) {
        return true
    }
    if (board.get(colour + 'R') > 0n) {
        return true
    }
    if (board.get(colour + 'Q') > 0n) {
        return true
    }
    return false
}