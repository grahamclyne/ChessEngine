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



// export function mapBoardState(board,colour:string,depth:number){
//     let moves = new Array();
//     let state = reduce(Array.from(board.values()), (x, y) => { return x + '' + y }, 0n)
//     if(BOARD_STATES.has(colour + state) ){
//         moves = BOARD_STATES.get(colour + state)
//     }
//     else{ 
//         moves = getMovesUCI(board,colour,[])
//         BOARD_STATES.set(colour + state, moves)
//     }    
//     if(depth == 0){
//         return 
//     }
//     for(let move of moves){
//         mapBoardState(game.makeMoveUCI(move,board,colour), colour,depth-1)
//     }

// }
async function query(board,colour,history) {
    let state = await reduce(Array.from(board.values()), (x, y) => { return x + '' + y }, 0n)
    const MongoClient = await require('mongodb').MongoClient; 
    const url = "mongodb://localhost:27017/"; 
    const db = await MongoClient.connect(url);
    const dbo = db.db("chess");
    let moves = new Array()
    const result = await dbo.collection("boards").find({board:colour+state}).toArray()
    if(result.length == 0){
        moves = await getMovesUCI(board,colour,history)
        await dbo.collection("boards").insertOne({board:colour+state,moves:moves})
    }
    else{
        moves = result[0]['moves']
    }
    return moves;
}

export async function minimax1alpha(position, depth:number, colour:string, alpha:number,beta:number,history) {
    let moves = await query(position.board,colour,history);
    let total = process.memoryUsage().heapTotal
    let used = process.memoryUsage().heapUsed
    console.log("HEAP USAGE: %d" ,used/total)
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
        let w = await minimax1alpha(child, depth - 1, oppColour, alpha,beta, history)
 
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
// class Node {
//     V:number;
//     adj: [];
//     addEdge(v,w){
//         this.adj.append(w)
//     }
// }

var TREE;
export function searchnoheap(board,colour,depth){
    TREE = new Map()
    TREE = {board:board,weight:0, children:[]}
    minimaxnoheap(colour,0,depth);
}

export function minimaxnoheap(colour,index,depth){
    if(depth == 0){
        return 
    }
    let children = TREE['children']
    for(let child of children){
        minimaxnoheap(colour,child['index'],depth-1)
    }
    
}

function bfs(tree) {
    if (tree.children.length == 0) {
        return;
    }
    tree.children.forEach(child => {
        bfs(child);
    });
}
function dfs(tree, max) {
    //if leaf node
    if (tree.children.length == 0) {
        return tree.weight;
    }
    tree.children.forEach(child => {
        let mmax = dfs(child, max);
        if (mmax > max) {
            max = mmax;
        }
    });
    if (max > tree.weight) {
        return max;
    }
    return tree.weight;
}