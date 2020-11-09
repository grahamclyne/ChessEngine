//minimax
//aplha beta pruning
//monte carlo

import { count_1s } from "./util"
import * as tree from "./tree"
import * as game from './game'
import { reduce } from 'lodash'


export function staticEvaluation(board, mobility) {
    let score = count_1s(board.get('WP')) - count_1s(board.get('BP'))
    score = score + (3 * (count_1s(board.get('WN')) + count_1s(board.get('WB')) - (count_1s(board.get('BN')) + count_1s(board.get('BB')))))
    score = score + (5 * (count_1s(board.get('WR')) - count_1s(board.get('BR'))))
    score = score + (9 * (count_1s(board.get('WQ')) - count_1s(board.get('BQ'))))
    score = score + (200 * (count_1s(board.get('WK')) - count_1s(board.get('BK'))))
  //  score = score + (0.1 * mobility)
    //is check
    return score
}

export function startMiniMax(colour, history, board) {
    let MAX_DEPTH = 3;
    return buildSearchSpace(colour, history, board, 0, { board: board, weight: 0, move: null, children: [] }, MAX_DEPTH)
}

function buildSearchSpace(colour, history, board, depth, node, enddepth) {
    let oppColour = (colour == 'W') ? 'B' : 'W'
    let moves = game.findMoves(colour, history, board)
    if (depth == enddepth) {
        let score = staticEvaluation(board, moves.length)
        node.weight = score
        return node
    }
    moves.forEach(move => {
        let tempBoard = game.makeMove(move, colour, board)
        let child: tree.TreeNode = { board: tempBoard, weight: 0, move: move, children: [] }
        child = buildSearchSpace(oppColour, history, tempBoard, depth + 1, child, enddepth)
        node.children.push(child)
    })
    return node
}


export function minimax1(position, depth, colour, board, history) {
    let moves = game.findMoves(colour, history, board)
    let oppColour = (colour == 'W') ? 'B' : 'W';
    let compareFunc = Math.max
    let evaluation = -Infinity
    if (colour == 'B') {
        compareFunc = Math.min
        evaluation = Infinity
    }
    if (depth == 0 /*|| game over?*/) {
        let weight = staticEvaluation(board, moves.length)
        return { board: position.board, weight: weight, move: position.move, children: position.children }
    }
    moves.forEach(move => {
        let tempBoard = game.makeMove(move, colour, board)
        let child = { board: tempBoard, weight: 0, move: move, children: [] }
        let w = minimax1(child, depth - 1, oppColour, child.board, history)
        evaluation = compareFunc(w.weight, evaluation)
        position.children.push(w)
    })

    return { board: position.board, weight: evaluation, move: position.move, children: position.children }
}



export function minimax1alpha(position, depth, colour, alpha,beta,board, history) {
    let moves = game.findMoves(colour, history, board)
    let oppColour = (colour == 'W') ? 'B' : 'W';
    let compareFunc = Math.max
    let evaluation = -Infinity
    if (colour == 'B') {
        compareFunc = Math.min
        evaluation = Infinity
    }
    if (depth == 0 /*|| game over?*/) {
        let weight = staticEvaluation(board, moves.length)
        return { board: position.board, weight: weight, move: position.move, children: position.children }
    }
    for(let move of moves) {
        let tempBoard = game.makeMove(move, colour, board)
        let child = { board: tempBoard, weight: 0, move: move, children: [] }
        let w = minimax1alpha(child, depth - 1, oppColour, alpha,beta,child.board, history)
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
   // console.log('alpha:', alpha, 'beta: ', beta)
    return { board: position.board, weight: evaluation, move: position.move, children: position.children }
}



export function minimax(position, depth, maximizing) {
    if (depth == 0 /*|| game over?*/) {
        return position.weight
    }
    if (maximizing) {
        let maxEval = -Infinity
        position.children.forEach(child => {
            let w = minimax(child, depth - 1, false)
            maxEval = Math.max(w, maxEval)

        })
        position.weight = maxEval
        return maxEval
    }
    else {
        let minEval = Infinity
        position.children.forEach(child => {
            let w = minimax(child, depth - 1, true)
            minEval = Math.min(w, minEval)
        })
        position.weight = minEval
        return minEval
    }
}


export function showAllChildren(node: tree.TreeNode, tabs) {
    let toPrint = ''
    let count = 0
    while (count < tabs) {
        toPrint = '\t' + toPrint
        count++
    }
    process.stdout.write(toPrint)
    tree.print(node)
    process.stdout.write('\n')

    node.children.forEach(child => {
        showAllChildren(child, tabs + 1)
    })
}