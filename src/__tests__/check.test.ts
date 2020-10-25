import * as bsutil from '../bitSetUtils'
import { checkCapture } from '../game'
import * as mp from '../moves'
import * as util from '../utils'
import * as check from '../check'
import * as R from 'ramda'
test('is white king in check from pawn', () => {
    let BP = [bsutil.set(0n, 11,1), "BP"]
    let WK = [bsutil.set(0n, 4, 1), "WK"]
    let board = util.newBoard(BP, WK);
    expect(check.isCheck(board.get('WK'),mp.getAttackBoard('B',board,true))).toBe(true)

})

test('is white king in check from rook', () => {
    let BR = [bsutil.set(0n, 8,1), "BR"]
    let WK = [bsutil.set(0n, 12, 1), "WK"]
    let board = util.newBoard(BR, WK); 
    expect(check.isCheck(board.get('WK'),mp.getAttackBoard('B',board,true))).toBe(true)

})

test('is black king in check from knight', () => {
    let BK = [bsutil.set(0n, 51,1), "BK"]
    let WN = [bsutil.set(0n, 36, 1), "WN"]
    let board = util.newBoard(BK, WN); 
    expect(check.isCheck(board.get('BK'),mp.getAttackBoard('W',board,true))).toBe(true)
})

test('is white king not in check from queen', () =>{
    let BQ = [bsutil.set(0n, 13,1), "BQ"]
    let WK = [bsutil.set(0n, 7, 1), "WK"]
    let board = util.newBoard(BQ, WK); 
    expect(check.isCheck(board.get('WK'),mp.getAttackBoard('B',board,true))).toBe(false)
})

test('is white in checkmate',()=>{
    let BR = [bsutil.set(0n, 8,1), "BR"]
    let BQ = [bsutil.set(0n,0,1), 'BQ']
    let WK = [bsutil.set(0n, 4, 1), "WK"]
    let board = util.newBoard(BR, WK,BQ); 
    let occ= R.reduce((x, y) => { return x | y }, 0n, Array.from(board.values()))
    let attack = mp.getAttackBoard('B',board,true)
    let kingCheck = check.isCheck(board.get('WK'),attack)
    let actualKings = mp.kingMovesActual(occ,4,attack)
    expect(check.isCheckMate(kingCheck,bsutil.lsb(board.get('WK')),occ,attack)).toBe(true)
})

