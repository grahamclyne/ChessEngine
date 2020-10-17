import {BitSet} from './bitset'




export function setRankMasks(){
        var rankMasks = [];
        var rank = new BitSet();
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
        console.log(rankMasks)
        return rankMasks;
    }
    
  export function  setFileMasks  () {
        var fileMasks = [];
        var file = new BitSet();
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

export function leftShift(bitSet,distance) {
    var shifted = new BitSet();
    bitSet.array.map(function(el,index,obj){
        if(bitSet.array[index] == 1 && (index - distance) >= 0){
            shifted.array[index - distance] = 1
        }
    })
    return shifted;
}
export function rightShift(bitSet, distance) {
    var shifted = new BitSet()
    bitSet.array.map(function(el,index,obj){
        if(bitSet.array[index] == 1 && (index + distance) <= 63){
            shifted.array[index + distance] = 1
        }
    })
    return shifted;
}
