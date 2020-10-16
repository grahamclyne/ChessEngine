import BitSet from 'bitset';
import * as helper from './Utils'

var rankMasks: BitSet[] = helper.setRankMasks();
var fileMasks: BitSet[] = helper.setFileMasks();
export const RANK_8:BitSet = rankMasks[7];
export const RANK_4:BitSet = rankMasks[3];
export const FILE_H:BitSet = fileMasks[7];
export const FILE_A:BitSet = fileMasks[0];