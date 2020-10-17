
import {BitSet }from "./bitset";
import * as wpp from './pawnPossibilities'
import * as utils from './utils'
import * as ts from 'typescript'
import { moveCursor } from "readline";
var WP = new BitSet();
var WR = new BitSet();
var WN = new BitSet();
var WB = new BitSet();
var WQ = new BitSet();
var WK = new BitSet();

var BP = new BitSet();
var BR = new BitSet();
var BN = new BitSet();
var BB = new BitSet();
var BQ = new BitSet();
var BK = new BitSet();

WP.setRange(8,15,1);
WR.set(0,1);
WR.set(7,1);
WN.set(1,1);
WN.set(6,1);
WB.set(2,1);
WB.set(5,1);
WQ.set(4,1);
WK.set(5,1);

BP.setRange(48,55,1);
BR.set(0+56,1);
BR.set(7+56,1);
BN.set(1+56,1);
BN.set(6+56,1);
BB.set(2+56,1);
BB.set(5+56,1);
BQ.set(4+56,1);
BK.set(5+56,1);
var board = [WP,WN,WB,WR,WQ,WK,BP,BN,BB,BR,BQ,BK]

export function pickMove(colour) {
    var movePossibilities = wpp.pawnPossibilities(WP,WN,WB,WR,WQ,WK,BP,BN,BB,BR,BQ,BK,colour)
    let rand = Math.floor(Math.random() * movePossibilities.length)
    var move = movePossibilities[rand]
    // console.log(movePossibilities)
    // console.log(rand, move)
    handleMoveType(move[3]) //TODO
    makeMove(move, move[2],colour)
}

export function checkCapture(move,board) {
  board.map(bitSet => 
    bitSet.array.map(function (el,index) {
      if(el == 1 && index == move){
        console.log("PIECE CAPTURED")
        bitSet.set(index, 0)
      }
    })
  )
}
export function makeMove(move, piece,colour) {
    let result = eval(ts.transpile(colour + piece))
    checkCapture(move[1], board)
    result.set(move[0], 0)
    result.set(move[1], 1)
}

export  function play() {
    var move_count = 0;
    while(move_count < 11) {
        pickMove('W')
        console.log("WHITE MOVE:");

     //   ((WP.or(BP)).print())
      prettyPrintBoard(WP,WN,WB,WR,WQ,WK,BP,BN,BB,BR,BQ,BK)
        pickMove('B')
        console.log("BLACK MOVE:");
     //   ((WP.or(BP)).print())
     prettyPrintBoard(WP,WN,WB,WR,WQ,WK,BP,BN,BB,BR,BQ,BK)

        move_count++
        console.log('\n')
     //   await sleep(1000)
    }
}
export function handleMoveType(move){
  if(move == 'N'){//normal
    return;
  }
  else if(move == 'P'){//pawn promotion

  }
  else if(move == 'EN'){ //en passant

  }
  else if(move == 'C'){//castle
  }
}

export function checkWinConditions(board){
  //no pieces
  //checkmate
  //stalemate
  //3 moves in a row
  //50 moves no capture
}
export function prettyPrintBoard(WP,WN,WB,WR,WQ,WK,BP,BN,BB,BR,BQ,BK){
  var finBoard = new BitSet();
  finBoard.array.fill("-- ")
  // WP.array.map(function(el,index){
  //   if(el == 1){
  //     finBoard.array[index] = 'WP '
  //   }
  // })
  // BP.array.map(function(el,index){
  //   if(el == 1){
  //     finBoard.array[index] = 'BP '
  //   }
  // })
  //Object.keys({BP})[0]
  finBoard.print()
  }
// function sleep(ms) {
//     return new Promise((resolve) => {
//       setTimeout(resolve, ms);
//     });
//   }   
