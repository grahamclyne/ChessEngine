import {startPositions} from './util'
import {play} from './game'
import {init_sliders_attacks} from './magic'
import { Logger } from "tslog";
import * as util from './util'
import { getMovesUCI } from './moves';
const log: Logger = new Logger({ name: "myLogger" });
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
log.info("initializing slider attacks...")
init_sliders_attacks(true)
init_sliders_attacks(false)
log.info("Done!")



//play(startPositions(), [], 'opp')

console.log(util.setRankMasks())
console.log(util.setFileMasks())
// let WP1 = bsutil.set(0n, 12, 1);
// let BP1 = bsutil.set(0n, 27, 1);
// let WP = [WP1, 'WP']
// let BP = [BP1, 'BP']
// let  BK = [bsutil.set(0n, 63, 1), "BK"]
// let WK = [bsutil.set(0n,0,1), 'WK']
// var hrstart = process.hrtime()
// //game.pickMoveUCI(util.newBoard(WP,BP,BK,WK),[],'W')
// mapBoardState(startPositions(),'B',2)
// mapBoardState(startPositions(),'W',2)
// console.log(BOARD_STATES)
// var hrend = process.hrtime(hrstart)
// console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
// x()

// //board = util.newBoard(WK,BK)
// let root = {board:board,weight:0,move:[],children:[]}
// //let mm = search.minimax1(root,2,'W',board,[])
// let mm = search.minimax1alpha(root,4,'W',-Infinity, Infinity,board,[])
// search.showAllChildren(mm,0)

