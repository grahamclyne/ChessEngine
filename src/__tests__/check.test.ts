import * as bsutil from '../bitSetUtils'
import { checkCapture } from '../game'
import * as mp from '../movePossibilities'
import * as util from '../utils'
import * as check from '../check'
test('is black king in check', () => {
    let WP = [bsutil.set(0n, 11,1), "WP"]
    let BK = [bsutil.set(0n, 4, 1), "BP"]
    let board = util.newBoard(WP, BK);
    expect(check.isKingCheck(BK,mp.getAttackBoard('W',board))).toBe(true)

})


test('is checkmate',()=>{

})