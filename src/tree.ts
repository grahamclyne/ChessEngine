import {reduce} from 'lodash'

export interface TreeNode {
    board:Map<string,bigint>
    move:any
    weight:number
    children?: TreeNode[] 
  }


//   function createSquare(config: TreeNode): { color: string; area: number } {
//     let newSquare = { color: "white", area: 100 };
//     if (config.color) {
//       newSquare.color = config.color;
//     }
//     if (config.width) {
//       newSquare.area = config.width * config.width;
//     }
//     return newSquare;
//   }
export function bfs(tree:TreeNode) {
    if(tree.children.length == 0){
        return
    }
    tree.children.forEach(child => {
        console.log(child.weight)
        bfs(child)
    })
}

export function dfs(tree:TreeNode){
    if(tree.children.length == 0){
        return
    }
    tree.children.forEach(child => {
        dfs(child)
        console.log(child.weight)
    })
}

export function checkForCycles(tree:TreeNode){

}

export function print(tree:TreeNode){
    let occupancy = reduce(Array.from(tree.board.values()), (x, y) => { return x | y }, 0n)
    process.stdout.write('board:' + occupancy + ' score:' + tree.weight + ' children: ' +  tree.children.length)

}