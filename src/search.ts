//minimax
//aplha beta pruning
//monte carlo

import { count_1s } from "./util"
import * as game from './game'
import { reduce } from 'lodash'
import * as util from './util'
import { isCheckMate } from "./check"
import {getMovesUCI} from './moves'
export function staticEvaluation(board, mobility) {
    let score = count_1s(board.get('WP')) - count_1s(board.get('BP'))
    score = score + (3 * (count_1s(board.get('WN')) + count_1s(board.get('WB')) - (count_1s(board.get('BN')) + count_1s(board.get('BB')))))
    score = score + (5 * (count_1s(board.get('WR')) - count_1s(board.get('BR'))))
    score = score + (9 * (count_1s(board.get('WQ')) - count_1s(board.get('BQ'))))
    score = score + (200 * (count_1s(board.get('WK')) - count_1s(board.get('BK'))))
    score = score + (0.1 * mobility)
    return score
}

export var BOARD_STATES = new Map();

export function mapBoardState(board,colour:string,depth:number){
    let moves = new Array();
    console.log(board,depth)
    let state = reduce(Array.from(board.values()), (x, y) => { return x + '' + y }, 0n)
    if(BOARD_STATES.has(colour + state) ){
        moves = BOARD_STATES.get(colour + state)
    }
    else{ 
        moves = getMovesUCI(board,colour,[])
        BOARD_STATES.set(colour + state, moves)
    }    
    if(depth == 0){
        return 
    }
    for(let move of moves){
        mapBoardState(game.makeMoveUCI(move,board,colour), colour,depth-1)
    }
}

export function minimax1alpha(position, depth:number, colour:string, alpha:number,beta:number,history) {
    
    let moves = new Array();
  //  let state = reduce(Array.from(position.board.values()), (x, y) => { return x | y }, 0n)
    // if(BOARD_STATES.has(colour + state) ){
    //     moves = BOARD_STATES.get(colour + state)
    // }
    // else{ 
        moves = getMovesUCI(position.board,colour,history)
    //     BOARD_STATES.set(colour + state, moves)
    // }
    let oppColour = (colour == 'W') ? 'B': 'W';
    let compareFunc = (colour == 'W') ? Math.max : Math.min;
    let evaluation = (colour == 'W') ? -Infinity : Infinity;

    if (depth == 0 || isCheckMate(colour, position.board, history)  || moves.length == 0) {
        let weight = staticEvaluation(position.board, moves.length)
        // util.prettyPrintBoard(position.board)
        // console.log(weight,alpha,beta,colour,position.move, position.children, depth)   
        return { board: position.board, weight: weight, move: position.move, children: position.children }
    }
  
    for(let move of moves) {
        let tempBoard = game.makeMoveUCI(move,position.board,colour)
        let child = { board: tempBoard, weight: 0, move: move, children: [] }
        let w = minimax1alpha(child, depth - 1, oppColour, alpha,beta, history)
 
        if(colour == 'W'){
            evaluation = compareFunc(w.weight,evaluation)
            alpha = compareFunc(alpha, w.weight)
        }
        else{
            evaluation = compareFunc(w.weight,evaluation)
            beta = compareFunc(beta,w.weight)
        }
        if(beta <= alpha){
            break
        }
        
        position.children.push(w)
    }
    return { board: position.board, weight: evaluation, move: position.move, children: position.children }
}


