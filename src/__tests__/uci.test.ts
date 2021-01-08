import * as game from '../game'
import * as util from '../util'

test('makeMoveUCI en passant', () => {
    let input = "d2d4 g8f6 d4d5 e7e5 d5e6".split(" ")
   
    let board = util.startPositions()
    for(let index = 0; index < input.length; index ++){
        board = game.makeMoveUCI(input[index],board,'W')
    }
    //util.prettyPrintBoard(board)
})

test('makeMoveUCI pawn promotion', () => {
    let input = "d2d4 e5e7 d4d5 c7c5 d5c6 d7d6 c6b7 b7c6 b7c8Q"
    let board = util.startPositions()
    for(let index = 0; index < input.length; index ++){
        board = game.makeMoveUCI(input[index],board,'W')
    }
    util.prettyPrintBoard(board)
})
