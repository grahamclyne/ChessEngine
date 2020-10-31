import * as readline from 'readline';
import * as bsutil from './bitSetUtils'
import { Logger } from "tslog";
import { generatePossibleMoves } from './moves';
import { findMoves } from './game';
const log: Logger = new Logger({ name: "myLogger" });

export function isValidMove(move, board, colour) {
    let pieceBoard = board.get(colour + move[2])
    if (!bsutil.get(pieceBoard, move[0])) {
        log.error(move[2] + ' does not exist on that square')
        return false
    }
    return true
}

//move syntax
//[piece][startsquare][endsquare]
//eg. Ke4e5
//Pe4e6
export function parseInput(colour, history, board) {

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        rl.setPrompt('Make your move: ')
        rl.prompt()
        let pieceName = ''
        let startSquare = ''
        let endSquare = ''
        rl.on('line', (move) => {
            if ((move == 'castle-queen') || (move == 'castle-king')) {
                resolve(move)
            }
            if (move.length != 5) {
                log.error('Improper input: need [PNKQBR][startfile][startrow][endfile][endrow]')
                rl.prompt()
            }
            else {
                pieceName = move[0].toUpperCase()
                startSquare = move.slice(1, 3)
                endSquare = move.slice(3, 5)
                startSquare = parseInputSquare(startSquare)
                endSquare = parseInputSquare(endSquare)
            }
            let validMoves = findMoves(colour, history, board)
            console.log(pieceName, startSquare, endSquare)

            validMoves.forEach(move => {
                if (move[0] == startSquare && move[1] == endSquare && pieceName == move[2]) {
                    resolve(move)
                    rl.close()
                }
            })
            resolve(null)
            rl.close()
            log.error('please choose a valid move')
        })
            
    
    })
}

export function parseInputSquare(sq) {
    let row = sq[0]
    let file = sq[1]
    let rows = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5, 'g': 6, 'h': 7 }
    return (rows[row] + ((file - 1) * 8))
}
