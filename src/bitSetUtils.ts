import * as utils from './utils'

export function printBitSet(bitSet) {
    bitSet = BigInt.asUintN(200, bitSet)
    var x = bitSet.toString(2).split("").reverse()
    x.map(function (el, index) {
        if ((index + 1) % 8 == 0 && index != 0) {
            process.stdout.write(el + "\n")
        }
        else {
            process.stdout.write(el)
        }
    })
    console.log("\n")
}

export function set(bitSet: bigint, index, value) {
    let x: bigint = utils.pow(2n, Number(index))
    return (value == 1) ? (x | bitSet) : bitSet & not(x)
}

export function setRange(bitSet: bigint, start, end, value) {
    while (start <= end) {
        bitSet = set(bitSet, start, 1)
        start++
    }
    return bitSet
}

//will return 1 or 0, depending on what is in that square
export function get(bitSet, index:number) :number  { 
    return ((bitSet & BigInt(Math.pow(2, index))) > 0) ? 1 : 0
}

export function lsb(bitSet) :number { //least set bit, not least significant bit
    return ilog2(BigInt((bitSet) & (-bitSet)))
}

export function msb(bitSet) :number{
    return msbWrapped(bitSet, 0)
}

export function msbWrapped(bitSet, acc) :number {//most set bit, not most significant bit
    if (bitSet <= 1) {
        return acc
    }
    else {
        return msbWrapped(bitSet / 2n, acc + 1)
    }
}

export function reverse(bitSet) {
    //split into 8 bit chunks
    return BigInt(0)
}

//can optimize via webassembly? see https://stackoverflow.com/questions/55355184/optimized-integer-logarithm-base2-for-bigint
function ilog2(n: bigint) :number {  // n is a positive non-zero BigInt
    const C1 = BigInt(1)
    const C2 = BigInt(2)
    for (var count = 0; n > C1; count++)  n = n / C2
    return count
} // example ilog2(16n)==4

export function not(bitSet) {
    bitSet = BigInt.asUintN(64, BigInt(~bitSet))
    return bitSet
}