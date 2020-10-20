import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";
import { createSolutionBuilder, findConfigFile } from "typescript";

export class BitSet {
    array;
    constructor() {
        this.array = new Array(64).fill(0);
    }
    // public and(bitSet: BitSet) {
    //     var anded = new BitSet()
    //     this.array.map(function(el,index,obj) {
    //         if(el == 1 && bitSet.array[index] == 1) {
    //             anded.array[index] = 1;
    //         }
    
    //     })
    //     return anded
    // }
    // public or(bitSet: BitSet) {
    //     var ored = new BitSet()
    //     this.array.map(function(el,index,obj) {
    //         if(el == 1 || bitSet.array[index] == 1) {
    //             ored.array[index] = 1;
    //         }
    
    //     })
    //     return ored
    // }
    // public set(index, value){
    //     if(index > 63){
    //         throw new Error();
    //     }
    //     this.array[index] = value;
    //     return this;
      
    // }
    public get(index) {
        return this.array[index];
    }
    // public setRange(start,end,value){
    //     for(var i = start; i <= end; i++){
    //        this.set(i, value) 
    //     }
    // }
    // public not(){
    //     var notted = new BitSet();
    //     this.array.map(function(el,index,obj) {
    //         if (el == 0) {
    //             notted.set(index,1)
    //         } 
    //         else {
    //             notted.set(index,0)
    //         }
    //     })
    // return notted;
   
    // public print() {
    //     var output = ""
    //     this.array.map(function(el,index,obj) {
    //         if((index + 1) % 8 == 0 && index != 0){
    //             process.stdout.write(el.toString() + '\n')
    //         }
    //         else{
    //             process.stdout.write(el.toString())
    //         }
    //         return true
    //     })
   
    public clear() {
        this.array.fill(0);
    }

    public clone() {
        var cloned = new BitSet();
        this.array.map(function(el,index,obj) {
            cloned.array[index] = el
        })
        return cloned;   
    }

}
