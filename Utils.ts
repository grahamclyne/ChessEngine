import * as bs from 'bitset'


export function printBitSet(bitSet) {
    var x = new bs.BitSet(bitSet)
    var count = 0
    var str = x.toString()  
    str = str.split("").reverse().join("")
    var newstr = ""
    while(count < 64){
        if(str[count] == undefined){
            if((count + 1) % 8 == 0){
                newstr = newstr + "0" + "\n"
            }
            else {
                newstr = newstr + "0"
            }
        }
        else if((count + 1) % 8 == 0 && count != 0){
            newstr = newstr + str[count] + "\n"
        }
        else{
            newstr = newstr + str[count]
        }
        count++
    }
    console.log(newstr)
}

export function setRankMasks(){
        var rankMasks = [];
        var rank = new bs.BitSet();
        var x = 0;
        while(x < 64) {
            if((x+1) % 8 == 0 && x != 0) {
                rankMasks.push(rank.set(x,1).clone());
                rank.clear();
            }
            else {
                rank.set(x,1);
            }
            x = x + 1;
        }
        return rankMasks;
    }
    
  export function  setFileMasks  () {
        var fileMasks = [];
        var file = new bs.BitSet();
        var y = 0
        var x = 0
        while(y < 8) {
            x = y
            while(x < 64) {
                file.set(x,1);
                x = x + 8 
            }
            fileMasks.push(file.clone());
            file.clear();
            y = y + 1;
        }
        return fileMasks
    }


export function leftShift (bitSet : bs.BitSet, distance : number) {
    var lsb = bitSet.lsb()
    var msb = bitSet.msb()
    var output = new bs.BitSet()
    if(msb == Infinity){
        msb = 63
    }
    while(lsb <= msb){
        var isSet = bitSet.get(lsb)
        if(isSet){
            output.set((lsb - distance), 1)
        }
        lsb = lsb + 1
    }
    return output.slice(0,63)
}

export function rightShift (bitSet : bs.BitSet, distance : number) {
    var lsb = bitSet.lsb()
    var msb = bitSet.msb()
    var output = new bs.BitSet()
    if(msb == Infinity){
        msb = 63
    }
    while(lsb <= msb){
        var isSet = bitSet.get(lsb)
        if(isSet){
            output.set((lsb + distance), 1)
        }
        lsb = lsb + 1
    }
    return output.slice(0,63)
}
