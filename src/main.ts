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


// let child5 = {board:0n, move:[], weight:5,children:[]}
// let child4 = {board:0n, move:[], weight:4,children:[child5]}
// let child3 = {board:0n, move:[], weight:3,children:[]}
// let child2 = {board:0n, move:[], weight:2,children:[]}
// let child1= {board:0n, move:[], weight:1,children:[]}

// let treeN = {board:0n, move:[], weight:0,children:[child1,child2,child3,child4]}
// //tree.bfs(treeN)
// tree.dfs(treeN)




// var hrstart = process.hrtime()
// let filled = search.startMiniMax('W',[],board)
// //search.showAllChildren(filled,0)

// var hrend = process.hrtime(hrstart)
// console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
// let used = memoryUsage()
// for (let key in used) {
//   console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
// }
