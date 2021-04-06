import * as bsutil from '../bitSetUtils'
import * as moves from '../moves'
import * as util from '../util'
import * as game from '../game'
import {reduce} from 'lodash'

import {init_sliders_attacks} from '../magic'


init_sliders_attacks(true)
init_sliders_attacks(false)

test('pawn: white moves 1 forward', () => {
    let WP = [bsutil.set(0n, 28, 1), "WP"]
    let BP = [bsutil.set(0n, 36, 1), "BP"]
    let board = util.newBoard(WP, BP);
    let m = moves.getPawnMoves(board, 'W', [])
    expect(m.length).toBe(0)
    board = board.set('BP', 0n)
    expect(moves.getPawnMoves(board, 'W', []).length).toBe(1)
})

test('pawn: black captures to left', () => {
    let WP = [bsutil.set(0n, 28, 1), "WP"]
    let BP = [bsutil.set(0n, 35, 1), "BP"]
    let board = util.newBoard(WP, BP);
    expect(moves.getPawnMoves(board, 'B', []).length).toBe(2)
    board.set('WP', 0n)
    expect(moves.getPawnMoves(board, 'B', []).length).toBe(1)
})

test('pawn: white captures to right', () => {
    let WP = [bsutil.set(0n, 24, 1), "WP"]
    let BP = [bsutil.set(0n, 33, 1), "BP"]
    let board = util.newBoard(WP, BP);
    expect(moves.getPawnMoves(board, 'W', []).length).toBe(2)
    board.set('BP', 0n)
    expect(moves.getPawnMoves(board, 'W', []).length).toBe(1)
})

test('pawn: black moves two forward', () => {
    let WP = [bsutil.set(0n, 33, 1), "WP"]
    let BP = [bsutil.set(0n, 49, 1), "BP"]
    let board = util.newBoard(WP, BP);
    expect(moves.getPawnMoves(board, 'B', []).length).toBe(1)
    board.set('WP', 0n)
    expect(moves.getPawnMoves(board, 'B', []).length).toBe(2)
})

test('pawn: white en passant move option', () => {
    let WP = [bsutil.set(0n, 36, 1), "WP"]
    let BP = [bsutil.set(0n, 37, 1), "BP"]
    let history = [[53, 37, 'P', 'N']]
    let board = util.newBoard(WP, BP);
    expect(moves.getPawnMoves(board, 'W', history).length).toBe(2)
    board.set('BP', 0n)
    expect(moves.getPawnMoves(board, 'W', []).length).toBe(1)
})

test('pawn: white en passant capture', () => {
    let WP = [bsutil.set(0n, 36, 1), "WP"]
    let BP = [bsutil.set(0n, 37, 1), "BP"]
    let history = [[53, 37, 'P', 'N']]
    let board = util.newBoard(WP, BP);
    board = game.makeMoveUCI(util.convertMoveToUCI([36,45,'P','EN','N'],'W'),board,'W')
    expect(util.count_1s(board.get('BP'))).toBe(0)
    expect(bsutil.get(board.get('WP'),45)).toBe(1)
})

test('pawn: black pawn promotion', () => {
    let WP = [bsutil.set(0n, 24, 1), "WP"]
    let BP = [bsutil.set(0n, 12, 1), "BP"]
    let board = util.newBoard(WP, BP);
    expect(moves.getPawnMoves(board, 'B', []).length).toBe(1)
    expect(moves.getPawnMoves(board, 'B', [])[0][3]).toBe('P')
})

test('king: king with potential check', () => {
    let WK = [bsutil.set(0n, 4n, 1), 'WK'];
    let BR = [bsutil.set(0n, 8n, 1), 'BR'];
    let board = util.newBoard(WK, BR)
    let colour = 'W'
    let pieces = board.get(colour + 'P') | board.get(colour + 'N') | board.get(colour + 'B') | board.get(colour + 'R') | board.get(colour + 'Q') | board.get(colour + 'K')
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    board.set('OCC', occupancy)
    expect(moves.kingMovesActual(4, moves.getAttackBoard('B', board, true),pieces)).toEqual(BigInt('0b101000'))
})

test('attack board generation: white', () => {
    let BP1 = bsutil.setRange(0n, 48, 55, 1);
    let BR1 = bsutil.set(0n, 0 + 56, 1)
    BR1 = bsutil.set(BR1, 7 + 56, 1)
    let BP = [BP1, 'BP']
    let BR = [BR1, 'BR']
    let board = util.newBoard(BP, BR)
    let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
    board.set('OCC', occupancy)
    let attackBoard = moves.getAttackBoard('B', board, false)
    expect(attackBoard).toEqual(
        BigInt("0b\
11111111\
10000001\
11111111\
00000000\
00000000\
00000000\
00000000\
00000000"))
})

test('pawn: attacks', () => {
    let WP1 = bsutil.setRange(0n, 8, 15, 1);
    expect(moves.pawnAttacks(WP1, 'W')).toStrictEqual([[BigInt('0b111111110000000000000000'), 0n, "P"]])
})

test('castling: black king side', () => {
    let BR1 = bsutil.set(0n, 63, 1)
    let BK1 = bsutil.set(0n, 60, 1)
    let BR = [BR1, 'BR']
    let BK = [BK1, 'BK']
    let board = util.newBoard(BK, BR)
    let occ = reduce( Array.from(board.values()),(x, y) => { return x | y }, 0n)
    let history = []
    expect(moves.canCastleKingSide(occ,history,'B',board)).toBe(true)

})

test('castling: white queen side', () => {
    let R1 = bsutil.set(0n, 0, 1)
    let K1 = bsutil.set(0n, 4, 1)
    let WR = [R1, 'WR']
    let WK = [K1, 'WK']
    let board = util.newBoard(WR,WK)
    let history = []
    let occ = reduce( Array.from(board.values()),(x, y) => { return x | y }, 0n)
    expect(moves.canCastleQueenSide(occ,history,'W',board)).toBe(true)
})

test('castling: rook already moved', () => {
    let R1 = bsutil.set(0n, 0, 1)
    let K1 = bsutil.set(0n, 4, 1)
    let WR = [R1, 'WR']
    let K = [K1, 'WK']
    let board = util.newBoard(WR,K)
    let history = [[0,1,'R','N']]
    let occ = reduce( Array.from(board.values()),(x, y) => { return x | y }, 0n)
    expect(moves.canCastleQueenSide(occ,history,'W',board)).toBe(false)
})

test('castling: other rook already move, can still castle', () => {
    let R1 = bsutil.set(0n, 0, 1)
    R1 = bsutil.set(R1, 7, 1)
    let K1 = bsutil.set(0n, 4, 1)
    let WR = [R1, 'WR']
    let K = [K1, 'WK']
    let board = util.newBoard(WR,K)
    let history = [[7,1,'R','N']]
    let occ = reduce(Array.from(board.values()),(x, y) => { return x | y }, 0n)
    expect(moves.canCastleQueenSide(occ,history,'W',board)).toBe(true)
    expect(moves.canCastleKingSide(occ,history,'W',board)).toBe(false)
})
test('castling: king already moved', () => {
    let R1 = bsutil.set(0n, 0, 1)
    R1 = bsutil.set(0n, 7, 1)
    let K1 = bsutil.set(0n, 4, 1)
    let WR = [R1, 'WR']
    let K = [K1, 'WK']
    let board = util.newBoard(WR,K)
    let history = [[4,12,'K','N']]
    let occ = reduce( Array.from(board.values()),(x, y) => { return x | y }, 0n)
    expect(moves.canCastleQueenSide(occ,history,'W',board)).toBe(false)
    expect(moves.canCastleKingSide(occ,history,'W',board)).toBe(false)
})

test('castling: piece in the way', () => {
    let R1 = bsutil.set(0n, 0, 1)
    let K1 = bsutil.set(0n, 4, 1)
    let B1 = bsutil.set(0n, 2, 1)
    let WR = [R1, 'WR']
    let K = [K1, 'WK']
    let B = [B1, 'WB']
    let board = util.newBoard(WR,K,B)
    let history = []
    let occ = reduce( Array.from(board.values()),(x, y) => { return x | y }, 0n)
    expect(moves.canCastleQueenSide(occ,history,'W',board)).toBe(false)
})

test('castling: white castles queenside', () => {
    let R1 = bsutil.set(0n, 0n, 1)
    let K1 = bsutil.set(0n, 4n, 1)
    let WR = [R1, 'WR']
    let K = [K1, 'WK']
    let board = util.newBoard(WR,K) 
    board = game.makeMoveUCI('e1c1',board,'W')
    expect(board.get('WK')).toBe(BigInt(0b100))
    expect(board.get('WR')).toBe(BigInt(0b1000))
})

test('castling: black moves king side', () => {
    let R1 = bsutil.set(0n, 63n, 1)
    let K1 = bsutil.set(0n, 60n, 1)
    let WR = [R1, 'BR']
    let K = [K1, 'BK']
    let board = util.newBoard(WR,K) 
    board = game.makeMoveUCI('e8g8',board,'B')
    expect(board.get('BK')).toBe(bsutil.pow(2n,62))
    expect(board.get('BR')).toBe(bsutil.pow(2n,61))
})

test('castling: through a check', () => {
    let R1 = bsutil.set(0n, 63n, 1)
    let K1 = bsutil.set(0n, 60n, 1)
    let Q1 = bsutil.set(0n,26n,1)
    let WR = [R1, 'BR']
    let K = [K1, 'BK']
    let Q = [Q1, 'WQ']
    let board = util.newBoard(WR,K,Q) 
    let move = moves.getMoves(board,'B',[])
    console.log(move)
    util.prettyPrintBoard(board)
    let occ = reduce( Array.from(board.values()),(x, y) => { return x | y }, 0n)
    bsutil.printBitSet(moves.getAttackBoard('W',board,false))
    console.log(moves.canCastleKingSide(occ,[],'B',board))
    expect(move).not.toContain('CASTLE-KING')
    expect(move).not.toContain('CASTLE-QUEEN')
})

test('pawn promotion: 1 forward', () => {
    let WP = [bsutil.set(0n, 58, 1), "WP"]
    let WQ = [bsutil.set(0n, 37, 1), "WQ"]
    let board = util.newBoard(WP, WQ);
    let move = [50, 58, 'P', 'P','']
    let out  = game.makeMoveUCI(util.convertMoveToUCI(move,'W'), board,'W')
    expect(util.count_1s(out.get('WP'))).toBe(0)
    expect(util.count_1s(out.get('WQ'))).toBe(2)
    expect(out.get('WQ')).toEqual(BigInt(Math.pow(2,58) + Math.pow(2,37)))
})

test('kingmoveactual: move into check is not allowed', () => {
    let WQ = [bsutil.set(0n,8,1), 'WQ']
    let BK = [bsutil.set(0n,4,1), 'BK']
    let WP = [bsutil.set(0n,5,1),'WP']
    let board = util.newBoard(WQ,BK,WP)
    let colour = 'W'
    let pieces = board.get(colour + 'P') | board.get(colour + 'N') | board.get(colour + 'B') | board.get(colour + 'R') | board.get(colour + 'Q') | board.get(colour + 'K')
    let attack = moves.getAttackBoard('W', board, true)
    expect(moves.kingMovesActual(4,attack,pieces)).toEqual(BigInt('0b00001000'))
})


test('getAttackMoves: return attack board of all pieces', () => {
    let WN = [bsutil.set(0n,28,1), 'WN']
    let WR = [bsutil.set(0n,7,1), 'WR']
    let BP = [bsutil.set(0n,55,1), 'BP']
    let board = util.newBoard(WN,WR,BP)
    let attack = moves.getAttackBoard('W', board, true)
    expect(attack).toEqual(BigInt('0b\
10000000\
10101000\
11000100\
10000000\
11000100\
10101000\
01111111'
))
})

test('kingMoves', () => {
    expect(moves.kingMoves(28)).toEqual(BigInt('0b\
00000000\
00000000\
00000000\
00111000\
00101000\
00111000\
00000000\
00000000'))
})

test('knightMoves', () => {
 expect(moves.knightMoves(28)).toEqual(BigInt('0b\
00000000\
00000000\
00101000\
01000100\
00000000\
01000100\
00101000\
00000000'))
})

test('findNoCheckMoves: contains no moves that jeopardize king', () => {
    let WK = [bsutil.set(0n,16,1), 'WK']
    let WP = [bsutil.set(0n,18,1), 'WP']
    let BR = [bsutil.set(0n,21,1), 'BR']
    let board = util.newBoard(WK,WP,BR)
    let movelist = moves.getMoves(board,'W',[])
    let movesNoCheck = moves.findNoCheckMoves(movelist,board,'W')
    expect(movesNoCheck.length).toBe(5)
})