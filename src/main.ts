import {startPositions} from './util'
import {play} from './game'
import {init_sliders_attacks, set_occupancy} from './magic'
import { Logger } from "tslog";
import * as util from './util'
import { getMovesUCI, rookMoves } from './moves';
import * as magic from './magic'
import { printBitSet } from './bitSetUtils';
import {reduce } from 'lodash'
const log: Logger = new Logger({ name: "myLogger" });
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://127.0.0.1:27017'
// log.info("initializing slider attacks...")
 init_sliders_attacks(true)
//init_sliders_attacks(false)
// log.info("Done!")


let attack_mask = magic.bMask(16);
let relevant_bits_count = util.count_1s(attack_mask);
let occupancy_indicies = (1 << relevant_bits_count);

let sq = 16
    for (let index = 0; index < 10; index++)
    {
       
            let occupancy = set_occupancy(index, relevant_bits_count, attack_mask);
            console.log(attack_mask)
            printBitSet(attack_mask)
            console.log(relevant_bits_count)
            console.log(occupancy)
            let magic_index = (occupancy * magic.bishop_magic_numbers[16]) >> (64n - BigInt(magic.nBBits[16]));
        //    rook_attacks[square][Number(magic_index)] = rookAttacksOnTheFly(occupancy,square);
            printBitSet(magic.bishopAttacksOnTheFly(occupancy,16))
            console.log(occupancy, ' ', magic.bishop_magic_numbers[16], ' ', occupancy * magic.bishop_magic_numbers[16])
    
        }
let board = startPositions()
let occupancy = reduce(Array.from(board.values()), (x, y) => { return x | y }, 0n)
//printBitSet(rookMoves(occupancy,34))
//printBitSet(magic.rook_attacks[40][Number(2732044504)])
printBitSet(magic.bMask(16))
//console.log(magic.bishop_attacks[16])
//play(startPositions(), [], 'opp')
// console.log(util.setRankMasks())
// console.log(util.setFileMasks())
// let WP1 = bsutil.set(0n, 12, 1);
// let BP1 = bsutil.set(0n, 27, 1);
// let WP = [WP1, 'WP']
// let BP = [BP1, 'BP']
// let  BK = [bsutil.set(0n, 63, 1), "BK"]
// let WK = [bsutil.set(0n,0,1), 'WK']
// var hrstart = process.hrtime()
// //game.pickMoveUCI(util.newBoard(WP,BP,BK,WK),[],'W')
// mapBoardState(startPositions(),'B',2)
// mapBoardState(startPositions(),'W',2)
// console.log(BOARD_STATES)
// var hrend = process.hrtime(hrstart)
// console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
// x()

// //board = util.newBoard(WK,BK)
// let root = {board:board,weight:0,move:[],children:[]}
// //let mm = search.minimax1(root,2,'W',board,[])
// let mm = search.minimax1alpha(root,4,'W',-Infinity, Infinity,board,[])
// search.showAllChildren(mm,0)

