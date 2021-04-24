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
 //init_sliders_attacks(true)
//init_sliders_attacks(false)
// log.info("Done!")


let attack_mask = magic.bMask(40);
let relevant_bits_count = util.count_1s(attack_mask);
let occupancy_indicies = (1 << relevant_bits_count);
let occ = set_occupancy(0,relevant_bits_count,attack_mask)
let sq = 40
    for (let index = 0; index < 10; index++)
    {
       console.log("NEW")
            let occupancy = set_occupancy(index, relevant_bits_count, attack_mask);
            console.log(attack_mask)
            printBitSet(attack_mask)
            console.log(relevant_bits_count)
            console.log(occupancy)
            let magic_index = (occupancy * magic.bishop_magic_numbers[40]) >> (64n - BigInt(magic.nBBits[40]));
            printBitSet(magic.bishopAttacksOnTheFly(occupancy,40))
            console.log(occupancy, ' ', magic.bishop_magic_numbers[40], ' ', occupancy * magic.bishop_magic_numbers[40])
    
        }
