import * as bsutil from '../bitSetUtils'
import * as utils from '../util'
import * as check from '../check'
import {reduce} from 'lodash'

test('is white king in check from pawn', () => {
    let BP = [bsutil.set(0n, 11,1), "BP"]
    let WK = [bsutil.set(0n, 4, 1), "WK"]
    let board = utils.newBoard(BP, WK);
    expect(check.isCheck('W', board)).toBe(true)

})

test('white king in check from rook', () => {
    let BR = [bsutil.set(0n, 8,1), "BR"]
    let WK = [bsutil.set(0n, 12, 1), "WK"]
    let board = utils.newBoard(BR, WK); 
    expect(check.isCheck('W',board)).toBe(true)

})

test('black king in check from knight', () => {
    let BK = [bsutil.set(0n, 51,1), "BK"]
    let WN = [bsutil.set(0n, 36, 1), "WN"]
    let board = utils.newBoard(BK, WN); 
    expect(check.isCheck('B',board)).toBe(true)
})

test('white king not in check from queen', () =>{
    let BQ = [bsutil.set(0n, 13,1), "BQ"]
    let WK = [bsutil.set(0n, 7, 1), "WK"]
    let board = utils.newBoard(BQ, WK); 
    expect(check.isCheck('W',board)).toBe(false)
})

test('white is in checkmate',()=>{
    let BR = [bsutil.set(0n, 8,1), "BR"]
    let BQ = [bsutil.set(0n,0,1), 'BQ']
    let WK = [bsutil.set(0n, 4, 1), "WK"]
    let board = utils.newBoard(BR, WK,BQ); 
    expect(check.isCheckMate('W',board,[])).toBe(1)
})

test('white is not in checkmate', () => {
    let BR = [bsutil.set(0n, 28,1), "BR"]
    let BQ = [bsutil.set(0n,8,1), 'BQ']
    let WK = [bsutil.set(0n, 12, 1), "WK"]
    let board = utils.newBoard(BR, WK,BQ); 
    expect(check.isCheckMate('W',board,[])).toBe(0)
})


test('white is in checkmate and surrounded by white pieces', () => {
    let WP = bsutil.set(0n,11,1)
    WP = bsutil.set(WP,12,1)
    let WP1 = [WP, "WP"]
    let WB = [bsutil.set(0n,5,1), 'WB']
    let WQ = [bsutil.set(0n,3,1), 'WQ']
    let BQ = [bsutil.set(0n,31,1), 'BQ']
    let WK = [bsutil.set(0n, 4, 1), "WK"]
    let board = utils.newBoard(WP1, WK,BQ,WB,WQ); 
    expect(check.isCheckMate('W',board,[])).toBe(1)
})

test('white is in check, making sure where king can take a piece, that piece is protected', () => {
    let WP1 = bsutil.set(0n,13,1)
    let WP = [WP1, "WP"]
    let BR = [bsutil.set(0n,12,1), 'BR']
    let BB = [bsutil.set(0n,28,1), 'BB']
    let BQ = [bsutil.set(0n,3,1), 'BQ']
    let WK = [bsutil.set(0n, 5, 1), "WK"]
    let board = utils.newBoard(WP, WK,BQ,BR,BB); 
    expect(check.isCheckMate('W',board,[])).toBe(1)
})


test('white is in check but a piece can intervene', () => {
    let WP = bsutil.set(0n,13,1)
    let WP1 = [WP, "WP"]
    let WR = [bsutil.set(0n,12,1), 'WR']
    let BB = [bsutil.set(0n,28,1), 'BB']
    let BQ = [bsutil.set(0n,3,1), 'BQ']
    let WK = [bsutil.set(0n, 5, 1), "WK"]
    let board = utils.newBoard(WP1, WK,BQ,WR,BB); 
    expect(check.isCheckMate('W',board,[])).toBe(0)
    expect(check.isCheck('W',board)).toBe(true)
})

test('stalemate', () => {
    let WP = [bsutil.set(0n,49,1),'WP']
    let WQ = [bsutil.set(0n,41,1), 'WQ']
    let BK = [bsutil.set(0n, 57, 1), "BK"]
    let board = utils.newBoard(BK,WQ,WP); 
    expect(check.isCheckMate('B',board,[])).toBe(2)
    expect(check.isCheck('B',board)).toBe(false)   
})

test('captpure out of check', () => {
    let BQ = [bsutil.set(0n,59,1),'BQ']
    let WQ = [bsutil.set(0n,58,1), 'WQ']
    let BK = [bsutil.set(0n, 60, 1), "BK"]
    let board = utils.newBoard(BK,WQ,BQ); 
    expect(check.isCheck('B',board)).toBe(false)
     
})
