import * as util from './util'
import * as bsutil from './bitSetUtils'
import * as game from './game'
import * as constants from './constants'
import * as moves from './moves'
import * as check from './check'
import * as tree from './tree'
import { memoryUsage } from 'process'
import * as search from './search'
import { reduce } from 'lodash'
import * as magic from './magic'

import { Logger } from "tslog";
const log: Logger = new Logger({ name: "myLogger" });


let BP1 = bsutil.setRange(0n, 48, 55, 1);
let BR1 = bsutil.set(0n, 0 + 56, 1)
BR1 = bsutil.set(BR1, 7 + 56, 1)
let BN1 = bsutil.set(0n, 1 + 56, 1)
BN1 = bsutil.set(BN1, 6 + 56, 1)
let BB1 = bsutil.set(0n, 2 + 56, 1)
BB1 = bsutil.set(BB1, 5 + 56, 1)
let BQ1 = bsutil.set(0n, 3 + 56, 1)
let BK1 = bsutil.set(0n, 4 + 56, 1)

let WP1 = bsutil.setRange(0n, 8, 15, 1);
let WR1 = bsutil.set(0n, 0, 1)
WR1 = bsutil.set(WR1, 7, 1)
let WN1 = bsutil.set(0n, 1, 1)
WN1 = bsutil.set(WN1, 6, 1)
let WB1 = bsutil.set(0n, 2, 1)
WB1 = bsutil.set(WB1, 5, 1)
let WQ1 = bsutil.set(0n, 3, 1)
let WK1 = bsutil.set(0n, 4, 1)

let BP = [BP1, 'BP']
let BR = [BR1, 'BR']
let BN = [BN1, 'BN']
let BB = [BB1, 'BB']
let BQ = [BQ1, 'BQ']
let BK = [BK1, 'BK']

let WP = [WP1, 'WP']
let WR = [WR1, 'WR']
let WN = [WN1, 'WN']
let WB = [WB1, 'WB']
let WQ = [WQ1, 'WQ']
let WK = [WK1, 'WK']

let board = util.newBoard(WP, WR, WN, WB, WQ, WK, BP, BR, BN, BB, BQ, BK)
let opponent = 'HMAN'
log.info("initializing slider attacks...")
magic.init_sliders_attacks(true)
magic.init_sliders_attacks(false)
log.info("Done!")
game.play(board, [], opponent)

// board = util.newBoard()
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
// let move = search.minimax(level1_1,3,true)
// console.log(move)
// let finMove = []
// level1_1.children.forEach(child => {
//     if (child.weight == move){
//         finMove = child.move
//     }
// })
// console.log(finMove)
// search.showAllChildren(level1_1,0)


// var hrstart = process.hrtime()
// let filled = search.startMiniMax('W',[],board)
// //search.showAllChildren(filled,0)

// var hrend = process.hrtime(hrstart)
// console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
// let used = memoryUsage()
// for (let key in used) {
//   console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
// }
