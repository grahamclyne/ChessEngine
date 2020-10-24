import * as bsutil from '../bitSetUtils'
import * as mp from '../movePossibilities'
import * as util from '../utils'


test('rook moves', () => {
    expect(0).toBe(0)
  //  var m = moves.rookMoves(board,0n)
   // expect(m.length).toBe(0)
 //   board.set('WP', 0n)
    //expect(moves.rookMoves(board).length).toBe(12)
})

test('pawn: white moves 1 forward', () => {
  
  let WP = [bsutil.set(0n, 28,1), "WP"]
  let BP = [bsutil.set(0n, 36, 1), "BP"]
  let board = util.newBoard(WP, BP);
  let moves = mp.getPawnMoves(board,'W',[])
  expect(moves.length).toBe(0)
  board.set(BP, 0n)
  expect(mp.getPawnMoves(board,'W',[]).length).toBe(1)
})

test('pawn: black captures to left', () => {
  let WP = [bsutil.set(0n, 28,1), "WP"]
  let BP = [bsutil.set(0n, 35, 1), "BP"]
  let board = util.newBoard(WP, BP);
  expect(mp.getPawnMoves(board,'B',[]).length).toBe(2)
  board.set(WP, 0n)
  expect(mp.getPawnMoves(board,'B',[]).length).toBe(1)
})

test('pawn: white captures to right', () => {
  let WP = [bsutil.set(0n, 24,1), "WP"]
  let BP = [bsutil.set(0n, 33, 1), "BP"]
  let board = util.newBoard(WP, BP);
  expect(mp.getPawnMoves(board,'W',[]).length).toBe(2)
  board.set(BP, 0n)
  expect(mp.getPawnMoves(board,'W',[]).length).toBe(1)
})

test('pawn: black moves two forward', () => {
  let WP = [bsutil.set(0n, 33,1), "WP"]
  let BP = [bsutil.set(0n, 49, 1), "BP"]
  let board = util.newBoard(WP, BP);
  expect(mp.getPawnMoves(board,'B',[]).length).toBe(1)
  board.set(WP, 0n)
  expect(mp.getPawnMoves(board,'B',[]).length).toBe(2)
})

test('pawn: white en passant', () => {
  let WP = [bsutil.set(0n, 36,1), "WP"]
  let BP = [bsutil.set(0n, 37, 1), "BP"]
  let history = [[53,37,'P','N']]
  let board = util.newBoard(WP, BP);
  expect(mp.getPawnMoves(board,'W',history).length).toBe(2)
  board.set(BP, 0n)
  expect(mp.getPawnMoves(board,'W',history).length).toBe(1)
})

test('pawn: black pawn promotion', () => {
  let WP = [bsutil.set(0n, 24,1), "WP"]
  let BP = [bsutil.set(0n, 12, 1), "BP"]
  let board = util.newBoard(WP, BP);
  expect(mp.getPawnMoves(board,'B',[]).length).toBe(1)
  expect(mp.getPawnMoves(board,'B',[])[0][3]).toBe('P')
})