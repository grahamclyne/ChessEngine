import * as util from './util'
import * as bsutil from './bitSetUtils'

export function bishopAttacksOnTheFly(occ, sq) {
    let attacks = 0n;
    let pieceRank = BigInt(sq) / 8n, pieceFile = BigInt(sq) % 8n, rank, file;
    for (rank = pieceRank + 1n, file = pieceFile + 1n; rank <= 7n && file <= 7n; rank++, file++) {
        let pos = (1n << (rank * 8n + file))
        attacks |= (pos);
        if (pos & occ) break;
    }
    for (rank = pieceRank + 1n, file = pieceFile - 1n; rank <= 7n && file >= 0n; rank++, file--) {
        let pos = (1n << (rank * 8n + file))
        attacks |= (pos);
        if (pos & occ) break;
    }
    for (rank = pieceRank - 1n, file = pieceFile + 1n; rank >= 0n && file <= 7n; rank--, file++) {
        let pos = (1n << (rank * 8n + file))
        attacks |= (pos);
        if (pos & occ) break;
    }
    for (rank = pieceRank - 1n, file = pieceFile - 1n; rank >= 0n && file >= 0n; rank--, file--) {
        let pos = (1n << (rank * 8n + file))
        attacks |= (pos);
        if (pos & occ) break;
    }
    return attacks;
}

export function rookAttacksOnTheFly(occ, sq) {
    let attacks = 0n;
    let pieceRank = BigInt(sq) / 8n, pieceFile = BigInt(sq) % 8n, rank, file;
    //rank to the right 

    for (rank = pieceRank + 1n; rank <= 7n; rank++) {

        //set bit to 1 (1n << ...) if not anded with occ)
        attacks |= (1n << (rank * 8n + pieceFile));
        if ((1n << (rank * 8n + pieceFile)) & occ) break;
    }
    //rank to the left
    for (rank = pieceRank - 1n; rank >= 0; rank--) {

        attacks |= (1n << (rank * 8n + pieceFile));
        if ((1n << (rank * 8n + pieceFile)) & occ) break;
    }
    //file above
    for (file = pieceFile + 1n; file <= 7n; file++) {
        attacks |= (1n << (pieceRank * 8n + file));
        if ((1n << (pieceRank * 8n + file)) & occ) break;
    }
    //file below
    for (file = pieceFile - 1n; file >= 0; file--) {

        attacks |= (1n << (pieceRank * 8n + file));
        if ((1n << (pieceRank * 8n + file)) & occ) break;
    }
    // return attack map
    return attacks;
}

export const nRBits = [
	12, 11, 11, 11, 11, 11, 11, 12,
	11, 10, 10, 10, 10, 10, 10, 11,
	11, 10, 10, 10, 10, 10, 10, 11,
	11, 10, 10, 10, 10, 10, 10, 11,
	11, 10, 10, 10, 10, 10, 10, 11,
	11, 10, 10, 10, 10, 10, 10, 11,
	11, 10, 10, 10, 10, 10, 10, 11,
	12, 11, 11, 11, 11, 11, 11, 12,
]

export const nBBits = [
	6, 5, 5, 5, 5, 5, 5, 6,
	5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 7, 7, 7, 7, 5, 5,
	5, 5, 7, 9, 9, 7, 5, 5,
	5, 5, 7, 9, 9, 7, 5, 5,
	5, 5, 7, 7, 7, 7, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5,
	6, 5, 5, 5, 5, 5, 5, 6,
]

export function rMask(sq: number) {

    let result = 0n;
    let rk = BigInt(sq) / 8n, fl = BigInt(sq) % 8n, r, f;
    for (r = rk + 1n; r <= 6n; r++) result |= (1n << (fl + r * 8n));
    for (r = rk - 1n; r >= 1n; r--) result |= (1n << (fl + r * 8n));
    for (f = fl + 1n; f <= 6n; f++) result |= (1n << (f + rk * 8n));
    for (f = fl - 1n; f >= 1n; f--) result |= (1n << (f + rk * 8n));
    return result;
}

export function bMask(sq: number) {
    let result = 0n;
    let rk = BigInt(sq) / 8n, fl = BigInt(sq) % 8n, r, f;
    for (r = rk + 1n, f = fl + 1n; r <= 6 && f <= 6; r++, f++) result |= (1n << (f + r * 8n));
    for (r = rk + 1n, f = fl - 1n; r <= 6 && f >= 1; r++, f--) result |= (1n << (f + r * 8n));
    for (r = rk - 1n, f = fl + 1n; r >= 1 && f <= 6; r--, f++) result |= (1n << (f + r * 8n));
    for (r = rk - 1n, f = fl - 1n; r >= 1 && f >= 1; r--, f--) result |= (1n << (f + r * 8n));
    return result;
}
//https://www.chessprogramming.org/Looking_for_Magics

export const  rook_magic_numbers = [
    0x8a80104000800020n,
    0x140002000100040n,
    0x2801880a0017001n,
    0x100081001000420n,
    0x200020010080420n,
    0x3001c0002010008n,
    0x8480008002000100n,
    0x2080088004402900n,
    0x800098204000n,
    0x2024401000200040n,
    0x100802000801000n,
    0x120800800801000n,
    0x208808088000400n,
    0x2802200800400n,
    0x2200800100020080n,
    0x801000060821100n,
    0x80044006422000n,
    0x100808020004000n,
    0x12108a0010204200n,
    0x140848010000802n,
    0x481828014002800n,
    0x8094004002004100n,
    0x4010040010010802n,
    0x20008806104n,
    0x100400080208000n,
    0x2040002120081000n,
    0x21200680100081n,
    0x20100080080080n,
    0x2000a00200410n,
    0x20080800400n,
    0x80088400100102n,
    0x80004600042881n,
    0x4040008040800020n,
    0x440003000200801n,
    0x4200011004500n,
    0x188020010100100n,
    0x14800401802800n,
    0x2080040080800200n,
    0x124080204001001n,
    0x200046502000484n,
    0x480400080088020n,
    0x1000422010034000n,
    0x30200100110040n,
    0x100021010009n,
    0x2002080100110004n,
    0x202008004008002n,
    0x20020004010100n,
    0x2048440040820001n,
    0x101002200408200n,
    0x40802000401080n,
    0x4008142004410100n,
    0x2060820c0120200n,
    0x1001004080100n,
    0x20c020080040080n,
    0x2935610830022400n,
    0x44440041009200n,
    0x280001040802101n,
    0x2100190040002085n,
    0x80c0084100102001n,
    0x4024081001000421n,
    0x20030a0244872n,
    0x12001008414402n,
    0x2006104900a0804n,
    0x1004081002402n
];

export const bishop_magic_numbers = [
    0x40040844404084n,
    0x2004208a004208n,
    0x10190041080202n,
    0x108060845042010n,
    0x581104180800210n,
    0x2112080446200010n,
    0x1080820820060210n,
    0x3c0808410220200n,
    0x4050404440404n,
    0x21001420088n,
    0x24d0080801082102n,
    0x1020a0a020400n,
    0x40308200402n,
    0x4011002100800n,
    0x401484104104005n,
    0x801010402020200n,
    0x400210c3880100n,
    0x404022024108200n,
    0x810018200204102n,
    0x4002801a02003n,
    0x85040820080400n,
    0x810102c808880400n,
    0xe900410884800n,
    0x8002020480840102n,
    0x220200865090201n,
    0x2010100a02021202n,
    0x152048408022401n,
    0x20080002081110n,
    0x4001001021004000n,
    0x800040400a011002n,
    0xe4004081011002n,
    0x1c004001012080n,
    0x8004200962a00220n,
    0x8422100208500202n,
    0x2000402200300c08n,
    0x8646020080080080n,
    0x80020a0200100808n,
    0x2010004880111000n,
    0x623000a080011400n,
    0x42008c0340209202n,
    0x209188240001000n,
    0x400408a884001800n,
    0x110400a6080400n,
    0x1840060a44020800n,
    0x90080104000041n,
    0x201011000808101n,
    0x1a2208080504f080n,
    0x8012020600211212n,
    0x500861011240000n,
    0x180806108200800n,
    0x4000020e01040044n,
    0x300000261044000an,
    0x802241102020002n,
    0x20906061210001n,
    0x5a84841004010310n,
    0x4010801011c04n,
    0xa010109502200n,
    0x4a02012000n,
    0x500201010098b028n,
    0x8040002811040900n,
    0x28000010020204n,
    0x6000020202d0240n,
    0x8918844842082200n,
    0x4010011029020020n
];

export function pop_bit(bitboard,square){
    return (bitboard &= bsutil.not(1n << BigInt(square)))
}

export function set_occupancy(index, bits_in_mask, attack_mask)
{
    let occupancy = 0n;
    // loop over the range of bits within attack mask
    for (let count = 0; count < bits_in_mask; count++)
    {
        let square = bsutil.lsb(attack_mask);
        attack_mask = pop_bit(attack_mask, square);
        
        // make sure occupancy is on board
        if (index & (1 << count))
            occupancy |= (1n << BigInt(square));
    }
    return occupancy;
}


export var bishop_attacks = []
export var rook_attacks = []

for(let i = 0; i < 64; i++){
    bishop_attacks[i] = new Array(4096n)
}
for(let i = 0; i < 64; i++){
    rook_attacks[i] = new Array(4096n)
}
export function init_sliders_attacks(bishop)
{
    for (let square = 0; square < 64; square++)
    {
        let attack_mask = bishop ? bMask(square) : rMask(square);
        let relevant_bits_count = util.count_1s(attack_mask);
        let occupancy_indicies = (1 << relevant_bits_count);
        for (let index = 0; index < occupancy_indicies; index++)
        {
            if (bishop)
            {
                let occupancy = set_occupancy(index, relevant_bits_count, attack_mask);
                let magic_index = (occupancy * bishop_magic_numbers[square]) >> (64n - BigInt(nBBits[square]));
                bishop_attacks[square][Number(magic_index)] = bishopAttacksOnTheFly(occupancy,square);
            }
            else
            {
                let occupancy = set_occupancy(index, relevant_bits_count, attack_mask);
                let magic_index = (occupancy * rook_magic_numbers[square]) >> (64n - BigInt(nRBits[square]));
                rook_attacks[square][Number(magic_index)] = rookAttacksOnTheFly(occupancy,square);
            
            }
        }
    }
}
