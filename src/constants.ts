import {BitSet} from './bitset';
import * as helper from './utils'

var rankMasks: BitSet[] = helper.setRankMasks();
var fileMasks: BitSet[] = helper.setFileMasks();
export const RANK_8:BitSet = rankMasks[7];
export const RANK_4:BitSet = rankMasks[3];
export const RANK_1:BitSet = rankMasks[0];
export const RANK_5:BitSet = rankMasks[4];
export const FILE_H:BitSet = fileMasks[7];
export const FILE_A:BitSet = fileMasks[0];