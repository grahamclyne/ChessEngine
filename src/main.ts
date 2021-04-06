import {startPositions} from './util'
import {play} from './game'
import {mapBoardState} from './search'
import {init_sliders_attacks} from './magic'
import { Logger } from "tslog";
const log: Logger = new Logger({ name: "myLogger" });
import {BOARD_STATES }from './search'


log.info("initializing slider attacks...")
init_sliders_attacks(true)
init_sliders_attacks(false)
log.info("Done!")
//play(startPositions(), [], 'opp')
// let WP1 = bsutil.set(0n, 12, 1);
// let BP1 = bsutil.set(0n, 27, 1);
// let WP = [WP1, 'WP']
// let BP = [BP1, 'BP']
// let  BK = [bsutil.set(0n, 63, 1), "BK"]
// let WK = [bsutil.set(0n,0,1), 'WK']
var hrstart = process.hrtime()
// //game.pickMoveUCI(util.newBoard(WP,BP,BK,WK),[],'W')
mapBoardState(startPositions(),'B',2)
mapBoardState(startPositions(),'W',2)
console.log(BOARD_STATES)
var hrend = process.hrtime(hrstart)
console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)


// //board = util.newBoard(WK,BK)
// let root = {board:board,weight:0,move:[],children:[]}
// //let mm = search.minimax1(root,2,'W',board,[])
// let mm = search.minimax1alpha(root,4,'W',-Infinity, Infinity,board,[])
// search.showAllChildren(mm,0)



// var hrstart = process.hrtime()
// let filled = search.startMiniMax('W',[],board)
// //search.showAllChildren(filled,0)

// var hrend = process.hrtime(hrstart)
// console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
// let used = memoryUsage()
// for (let key in used) {
//   console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
// }
//  BQ = [bsutil.set(0n,59,1),'BQ']
//  WQ = [bsutil.set(0n,58,1), 'WQ']
//  BK = [bsutil.set(0n, 60, 1), "BK"]
//  board = util.newBoard(BK,WQ,BQ); 
// console.log(check.isCheck('B',board))
// console.log(moves.getMoves(board,'B',[])) 


// let b = util.parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
// util.prettyPrintBoard(b)
// let WP = [bsutil.set(0n, 36, 1), "WP"]
// let BP = [bsutil.set(0n, 37, 1), "BP"]
// let move = ''
// let board = util.newBoard(WP, BP);
// board = game.makeMoveUCI(move, board,'B')

// util.prettyPrintBoard(board)