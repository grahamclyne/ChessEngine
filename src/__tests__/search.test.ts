import * as search from '../search'
import * as bsutil from '../bitSetUtils'
import * as util from '../util'

test('staticEvaluation: a king and two pawns', () => {
    let WP = [bsutil.set(0n, 1, 1), 'WP']
    let WR = [bsutil.set(0n, 2, 1), 'WR']
    let BK = [bsutil.set(0n, 3, 1), 'BK']
    let board = util.newBoard(WP,WR,BK)
    expect(search.staticEvaluation(board,0)).toBe(-194)
})

test('minimax', () => {
    let board = util.newBoard()
let level4_1 = {board:board, move:[], weight:1,children:[]}
let level4_2 = {board:board, move:[], weight:7,children:[]}
let level4_3 = {board:board, move:[], weight:8,children:[]}
let level4_4 = {board:board, move:[], weight:6,children:[]}
let level4_5 = {board:board, move:[], weight:5,children:[]}
let level4_6 = {board:board, move:[], weight:-11,children:[]}
let level4_7 = {board:board, move:[], weight:40,children:[]}
let level4_8 = {board:board, move:[], weight:12,children:[]}
let level3_1= {board:board, move:[], weight:5,children:[level4_1,level4_2]}
let level3_2= {board:board, move:[], weight:4,children:[level4_3,level4_4]}
let level3_3= {board:board, move:[], weight:5,children:[level4_5,level4_6]}
let level3_4= {board:board, move:[], weight:4,children:[level4_7,level4_8]}
let level2_1= {board:board, move:[], weight:3,children:[level3_1,level3_2]}
let level2_2= {board:board, move:[], weight:2,children:[level3_3,level3_4]}
let level1_1= {board:board, move:[], weight:1,children:[level2_1,level2_2]}
//7
//7       5
//7   8   5     40 
//1 7 8 6 5 -11 40 12
//tree.bfs(treeN)
expect(search.minimax(level1_1,3,true)).toBe(7)

})