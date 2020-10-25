import * as bsutil from '../bitSetUtils'
import * as mp from '../moves'
import * as util from '../utils'
import * as R from 'ramda'

test('rook moves', () => {
  expect(0).toBe(0)
  //  var m = moves.rookMoves(board,0n)
  // expect(m.length).toBe(0)
  //   board.set('WP', 0n)
  //expect(moves.rookMoves(board).length).toBe(12)
})

test('pawn: white moves 1 forward', () => {

  let WP = [bsutil.set(0n, 28, 1), "WP"]
  let BP = [bsutil.set(0n, 36, 1), "BP"]
  let board = util.newBoard(WP, BP);
  let moves = mp.getPawnMoves(board, 'W', [])
  expect(moves.length).toBe(0)
  board = board.set('BP', 0n)
  expect(mp.getPawnMoves(board, 'W', []).length).toBe(1)
})

test('pawn: black captures to left', () => {
  let WP = [bsutil.set(0n, 28, 1), "WP"]
  let BP = [bsutil.set(0n, 35, 1), "BP"]
  let board = util.newBoard(WP, BP);
  expect(mp.getPawnMoves(board, 'B', []).length).toBe(2)
  board.set('WP', 0n)
  expect(mp.getPawnMoves(board, 'B', []).length).toBe(1)
})

test('pawn: white captures to right', () => {
  let WP = [bsutil.set(0n, 24, 1), "WP"]
  let BP = [bsutil.set(0n, 33, 1), "BP"]
  let board = util.newBoard(WP, BP);
  expect(mp.getPawnMoves(board, 'W', []).length).toBe(2)
  board.set('BP', 0n)
  expect(mp.getPawnMoves(board, 'W', []).length).toBe(1)
})

test('pawn: black moves two forward', () => {
  let WP = [bsutil.set(0n, 33, 1), "WP"]
  let BP = [bsutil.set(0n, 49, 1), "BP"]
  let board = util.newBoard(WP, BP);
  expect(mp.getPawnMoves(board, 'B', []).length).toBe(1)
  board.set('WP', 0n)
  expect(mp.getPawnMoves(board, 'B', []).length).toBe(2)
})

test('pawn: white en passant', () => {
  let WP = [bsutil.set(0n, 36, 1), "WP"]
  let BP = [bsutil.set(0n, 37, 1), "BP"]
  let history = [[53, 37, 'P', 'N']]
  let board = util.newBoard(WP, BP);
  expect(mp.getPawnMoves(board, 'W', history).length).toBe(2)
  board.set('BP', 0n)
  expect(mp.getPawnMoves(board, 'W',[]).length).toBe(1)
})

test('pawn: black pawn promotion', () => {
  let WP = [bsutil.set(0n, 24, 1), "WP"]
  let BP = [bsutil.set(0n, 12, 1), "BP"]
  let board = util.newBoard(WP, BP);
  expect(mp.getPawnMoves(board, 'B', []).length).toBe(1)
  expect(mp.getPawnMoves(board, 'B', [])[0][3]).toBe('P')
})

test('king: king with potential check', () => {
  let WK = [bsutil.set(0n, 4n, 1),'WK'];
  let BR = [bsutil.set(0n, 8n, 1),'BR'];
  let board = util.newBoard(WK,BR)
  let occupancy = R.reduce((x, y) => { return x | y }, 0n, Array.from(board.values()))

  expect(mp.kingMovesActual(occupancy,4,mp.getAttackBoard('B',board,true))).toBe(BigInt('0b101000'))
})

test('attack board generation: white', () => {
  let BP1 = bsutil.setRange(0n, 48, 55, 1);
  let BR1 = bsutil.set(0n, 0 + 56, 1)
  BR1 = bsutil.set(BR1, 7 + 56, 1)
  let BP = [BP1, 'BP']
  let BR = [BR1, 'BR']
  let board = util.newBoard(BP, BR)
  let attackBoard = mp.getAttackBoard('B', board,false)
  expect(attackBoard).toBe(
    BigInt("0b\
01111110\
00000000\
11111111\
00000000\
00000000\
00000000\
00000000\
00000000"))
})

test('pawn: attacks', () => {
  let WP1 = bsutil.setRange(0n,8,15,1);
  let attacks = mp.pawnAttacks(WP1,'W')
  expect(mp.pawnAttacks(WP1,'W')).toStrictEqual([[BigInt('0b111111110000000000000000'),0n,"P"]])
})