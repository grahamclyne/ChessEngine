



export function printBitSet(bitSet) {
    bitSet = BigInt.asUintN(64,BigInt(bitSet))
    var x = bitSet.toString(2).split("").reverse()
    x.map(function(el, index){
        if((index + 1) % 8 == 0 && index != 0) {
            process.stdout.write(el + "\n")
        }
        else{
            process.stdout.write(el)
        }
    })
    console.log("\n")
}
export function set(bitSet:bigint, index, value) {
    let x:bigint = BigInt(Math.floor(Math.pow(2, (index))))
    x = (x >> 0n)
    if(value == 1){
        return (x|bitSet)
    }
    else{
        return (bitSet|(~x))
    }
}
export function setRange(bitSet:bigint, start, end, value){
    while(start <= end) {
        bitSet = set(bitSet,start,1)
        start++
    }
    return bitSet
}
export function get(bitSet, index){
    if((bitSet&BigInt(Math.pow(2,index))) > 0){
        return 1
    }
    else {
        return 0
    }
}


export function  lsb(bitSet) {
    return 0
}
export function msb(bitSet) {
    return 0
}