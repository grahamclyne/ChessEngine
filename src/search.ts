//minimax
//aplha beta pruning
//monte carlo

import { count_1s } from "./util"
import * as tree from "./tree"
import * as game from './game'
import * as reduce from 'lodash'
export function staticEvaluation(colour, board,mobility) {
    let oppColour = (colour == 'W') ? 'B' : 'W'
    let score = count_1s(board.get(colour + 'P')) - count_1s(board.get(oppColour + 'P'))
    score = score + (3 * (count_1s(board.get(colour + 'N')) + count_1s(board.get(colour + 'B')) - (count_1s(board.get(oppColour + 'N')) + count_1s(board.get(oppColour + 'B')))))
    score = score + (5 * (count_1s(board.get(colour + 'R')) - count_1s(board.get(oppColour + 'R'))))
    score = score + (9 * (count_1s(board.get(colour + 'Q')) - count_1s(board.get(oppColour + 'Q'))))
    score = score + (200 * (count_1s(board.get(colour + 'K')) - count_1s(board.get(oppColour + 'K'))))
    score = score + (0.1 * mobility)

    return score
}
// int negaMax( int depth ) {
//     if ( depth == 0 ) return evaluate();
//     int max = -oo;
//     for ( all moves)  {
//         score = -negaMax( depth - 1 );
//         if( score > max )
//             max = score;
//     }
//     return max;
// 
export function startMiniMax(colour,history,board){
    let root:tree.TreeNode = {board:board,weight:0, move:null,children:[]}
    let filled = minimax(colour,history,board,0,root,1)
    return filled
}
export function minimax(colour,history,board,depth,node, enddepth){
    let oppColour = (colour == 'W') ? 'B' : 'W'
    if(depth == enddepth){
        return node
    }
    let moves = game.findMoves(colour,history,board)
    moves.forEach(move => {
        let tempBoard = game.makeMove(move,colour,board)
        let occupancy = reduce(Array.from(tempBoard.values()), (x, y) => { return x | y }, 0n)

        let score = staticEvaluation(colour,occupancy, moves.length)
        let child:tree.TreeNode = {board:occupancy, weight:score,move:move, children:[]}
        child = minimax(oppColour,history,tempBoard,depth + 1, child,enddepth)
        node.children.push(child)
    })
    return node
    
}
// f(p) = 200(K-K')
//        + 9(Q-Q')
//        + 5(R-R')
//        + 3(B-B' + N-N')
//        + 1(P-P')
//        - 0.5(D-D' + S-S' + I-I')
//        + 0.1(M-M') + ...


//i want to start by doing a very naive minimax, no move ordering or alpha beta 

export function showAllChildren(node : tree.TreeNode){
    if(node.children.length == 0){
        return 
    }
    node.children.forEach(child => {
        console.log(node)
        showAllChildren(child)
    })
}