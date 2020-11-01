import * as search from '../search'
import * as bsutil from '../bitSetUtils'
import * as util from '../util'

test('staticEvaluation: a king and two pawns', () => {
    let WP = [bsutil.set(0n, 1, 1), 'WP']
    let WR = [bsutil.set(0n, 2, 1), 'WR']
    let BK = [bsutil.set(0n, 3, 1), 'BK']
    let board = util.newBoard(WP,WR,BK)
    expect(search.staticEvaluation('W', board,0)).toBe(-194)
})

