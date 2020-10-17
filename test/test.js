var BitSet = require("../dist/bitset");
var assert = require('assert')

let b = new BitSet.BitSet();

describe('BitSet', function () {
    describe('#set', function () {
        it('should return true when trying to set 10th bit to 1', function () {
            assert.equal(b.set(10,1),true)
        }),
        it('should return false when trying to set 100th bit to 1', function () {
            assert.equal(b.set(100,1), true)
        })
    }),
    describe('#print', function () {
        it('should return true'), function () {
            console.log(b.print())
            assert(true)
        }
    })
})