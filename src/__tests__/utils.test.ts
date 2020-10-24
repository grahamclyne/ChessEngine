import * as constants from '../constants'
import * as bsutil from '../bitSetUtils'
import * as util from '../utils'
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants'
test('rankMasks', () => {
    let vals = [255n,65280n,16711680n, 4278190080n,1095216660480n,280375465082880n,71776119061217280n,18374686479671623680n]
    constants.rankMasks.map((el, index) => {
    expect(el).toBe(vals[index]);
    })
})

test('get from bitset', () => {
    let mask = 65280n;
    expect(bsutil.get(mask,11)).toBe(1);
    expect(bsutil.get(mask,55)).toBe(0);
})

test('set bitset', () => {
    let mask = 0n;
    expect(bsutil.set(mask,7,1)).toBe(128n)
//    expect(bsutil.set(mask,64,1)).toBe(Math.pow(2,64))
})

test('lsb', () => {
    let mask0 = 1n;
    let mask = 2n;
    let mask1 = 4n;
    let mask2 = 7n;
    let mask3 = 16n;
    let mask4 = 256n;
    let mask5 = 255n;
    let mask6 = bsutil.set(0n, 20, 1)
    expect(bsutil.lsb(mask0)).toBe(0)
    expect(bsutil.lsb(mask)).toBe(1)
    expect(bsutil.lsb(mask1)).toBe(2)
    expect(bsutil.lsb(mask2)).toBe(0)
    expect(bsutil.lsb(mask3)).toBe(4)
    expect(bsutil.lsb(mask4)).toBe(8)
    expect(bsutil.lsb(mask5)).toBe(0)
    expect(bsutil.lsb(mask6)).toBe(20)
})

test('msb', () => {
    let mask = 2n;
    let mask1 = 4n;
    let mask2 = 7n;
    let mask3 = 16n;
    let mask4 = 256n;
    let mask5 = 255n;
    expect(bsutil.msb(mask)).toBe(1)
    expect(bsutil.msb(mask1)).toBe(2)
    expect(bsutil.msb(mask2)).toBe(2)
    expect(bsutil.msb(mask3)).toBe(4)
    expect(bsutil.msb(mask4)).toBe(8)
    expect(bsutil.msb(mask5)).toBe(7)
})

test('not', () => {
    let mask = BigInt(Math.pow(2, 64))
    expect(bsutil.not(mask)).toBe(BigInt(Math.pow(2,64))-1n)
})
