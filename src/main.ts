import * as util from './util'
import * as bsutil from './bitSetUtils'
import * as game from './game'
import * as moves from './moves'
import * as check from './check'
import * as tree from './tree'
import { memoryUsage } from 'process'
import * as search from './search'
import { reduce } from 'lodash'
import * as magic from './magic'

import { Logger } from "tslog";
const log: Logger = new Logger({ name: "myLogger" });



let opponent = 'HMAN'
// log.info("initializing slider attacks...")
// magic.init_sliders_attacks(true)
// magic.init_sliders_attacks(false)
// log.info("Done!")
//game.play(util.startPosition(), [], opponent)

// //board = util.newBoard()
// let level4_1 = {board:board, move:[], weight:10,children:[]}
// let level4_2 = {board:board, move:[], weight:7,children:[]}
// let level4_3 = {board:board, move:[], weight:8,children:[]}
// let level4_4 = {board:board, move:[], weight:6,children:[]}
// let level4_5 = {board:board, move:[], weight:5,children:[]}
// let level4_6 = {board:board, move:[], weight:-11,children:[]}
// let level4_7 = {board:board, move:[], weight:40,children:[]}
// let level4_8 = {board:board, move:[], weight:12,children:[]}
// let level3_1= {board:board, move:[], weight:5,children:[level4_1,level4_2]}
// let level3_2= {board:board, move:[], weight:4,children:[level4_3,level4_4]}
// let level3_3= {board:board, move:[], weight:5,children:[level4_5,level4_6]}
// let level3_4= {board:board, move:[], weight:4,children:[level4_7,level4_8]}
// let level2_1= {board:board, move:['zz'], weight:3,children:[level3_1,level3_2]}
// let level2_2= {board:board, move:['yy'], weight:2,children:[level3_3,level3_4]}
// let level1_1= {board:board, move:['xx'], weight:1,children:[level2_1,level2_2]}
// //7
// //7       5
// //7   8   5     40 
// //1 7 8 6 5 -11 40 12
// //tree.bfs(treeN)
// // let move = search.minimax(level1_1,3,true)
// // console.log(move)
// // let finMove = []
// // level1_1.children.forEach(child => {
// //     if (child.weight == move){
// //         finMove = child.move
// //     }
// // })
// // console.log(finMove)
// // search.showAllChildren(level1_1,0)

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


let b = util.parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
util.prettyPrintBoard(b)