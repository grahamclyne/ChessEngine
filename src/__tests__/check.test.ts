import * as bsutil from '../bitSetUtils'
import * as util from '../utils'
import * as check from '../check'
import {reduce} from 'lodash'

test('is white king in check from pawn', () => {
    let BP = [bsutil.set(0n, 11,1), "BP"]
    let WK = [bsutil.set(0n, 4, 1), "WK"]

    let board = util.newBoard(BP, WK);
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    board.set('OCC', occupancy)
    expect(check.isCheck('W', board)).toBe(true)

})

test('white king in check from rook', () => {
    let BR = [bsutil.set(0n, 8,1), "BR"]
    let WK = [bsutil.set(0n, 12, 1), "WK"]
    let board = util.newBoard(BR, WK); 
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    board.set('OCC', occupancy)
    expect(check.isCheck('W',board)).toBe(true)

})

test('black king in check from knight', () => {
    let BK = [bsutil.set(0n, 51,1), "BK"]
    let WN = [bsutil.set(0n, 36, 1), "WN"]
    let board = util.newBoard(BK, WN); 
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    board.set('OCC', occupancy)
    expect(check.isCheck('B',board)).toBe(true)
})

test('white king not in check from queen', () =>{
    let BQ = [bsutil.set(0n, 13,1), "BQ"]
    let WK = [bsutil.set(0n, 7, 1), "WK"]
    let board = util.newBoard(BQ, WK); 
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    board.set('OCC', occupancy)
    expect(check.isCheck('W',board)).toBe(false)
})

test('white is in checkmate',()=>{
    let BR = [bsutil.set(0n, 8,1), "BR"]
    let BQ = [bsutil.set(0n,0,1), 'BQ']
    let WK = [bsutil.set(0n, 4, 1), "WK"]
    let board = util.newBoard(BR, WK,BQ); 
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    board.set('OCC', occupancy)
    expect(check.isCheckMate('W',board)).toBe(true)
})

test('white is not in checkmate', () => {
    let BR = [bsutil.set(0n, 28,1), "BR"]
    let BQ = [bsutil.set(0n,8,1), 'BQ']
    let WK = [bsutil.set(0n, 12, 1), "WK"]
    let board = util.newBoard(BR, WK,BQ); 
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    board.set('OCC', occupancy)
    expect(check.isCheckMate('W',board)).toBe(false)
})


test('white is in checkmate and surrounded by white pieces', () => {
    let WP = bsutil.set(0n,11,1)
    WP = bsutil.set(WP,12,1)
    let WP1 = [WP, "WP"]
    let WB = [bsutil.set(0n,5,1), 'WB']
    let WQ = [bsutil.set(0n,3,1), 'WQ']
    let BQ = [bsutil.set(0n,31,1), 'BQ']
    let WK = [bsutil.set(0n, 4, 1), "WK"]
    let board = util.newBoard(WP1, WK,BQ,WB,WQ); 
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    board.set('OCC', occupancy)
    expect(check.isCheckMate('W',board)).toBe(true)
})