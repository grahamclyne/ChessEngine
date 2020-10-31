import * as util from './util'

export const rankMasks: bigint[] = util.setRankMasks();
export const fileMasks: bigint[] = util.setFileMasks();
export const RANK_8:bigint = rankMasks[7];
export const RANK_4:bigint = rankMasks[3];
export const RANK_1:bigint = rankMasks[0];
export const RANK_2:bigint = rankMasks[1];
export const RANK_3:bigint = rankMasks[2];
export const RANK_5:bigint = rankMasks[4];
export const FILE_H:bigint = fileMasks[7];
export const FILE_G:bigint = fileMasks[6];
export const FILE_B:bigint = fileMasks[1];
export const FILE_A:bigint = fileMasks[0];