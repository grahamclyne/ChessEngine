import {reduce} from 'lodash'

export interface TreeNode {
    board:Map<string,bigint>
    move:any
    weight:number
    children?: TreeNode[] 
  }

export function bfs(tree:TreeNode) {
    if(tree.children.length == 0){
        return
    }
    tree.children.forEach(child => {
        console.log(child.weight)
        bfs(child)
    })
}

export function dfs(tree:TreeNode,max){

    //if leaf node
    if(tree.children.length == 0){
        return tree.weight
    }
    tree.children.forEach(child => {
        
        let mmax = dfs(child,max)
        if(mmax > max){
            max = mmax
        }
    })
    if(max > tree.weight){
        return max
    }
    return tree.weight

}

export function print(tree:TreeNode){
    let occupancy = reduce(Array.from(tree.board.values()), (x, y) => { return x | y }, 0n)
    process.stdout.write('board:' + occupancy + ' score:' + tree.weight + ' move: ' + tree.move + ' children: ' +  tree.children.length)

}

