import * as constants from '../constants'
import * as bsutil from '../bitSetUtils'
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