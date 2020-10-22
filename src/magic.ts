import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";
import * as bsutil from './bitSetUtils'
export function count_1s(b) {
    let r = 0n;
    for(r = 0n; b; r++, b &= b - 1n);
    return r;
  }
export function bishopAttacksOnTheFly(occ, sq) {
    let attacks = 0n;
    let pieceRank = sq / 8n, pieceFile = sq % 8n, rank, file;
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
    let pieceRank = sq / 8n, pieceFile = sq % 8n, rank, file;
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

export function rMask(sq: bigint) {
    let result = 0n;
    let rk = sq / 8n, fl = sq % 8n, r, f;
    for (r = rk + 1n; r <= 6n; r++) result |= (1n << (fl + r * 8n));
    for (r = rk - 1n; r >= 1n; r--) result |= (1n << (fl + r * 8n));
    for (f = fl + 1n; f <= 6n; f++) result |= (1n << (f + rk * 8n));
    for (f = fl - 1n; f >= 1n; f--) result |= (1n << (f + rk * 8n));
    return result;
}


export function bMask(sq: bigint) {
    let result = 0n;
    let rk = sq / 8n, fl = sq % 8n, r, f;
    for (r = rk + 1n, f = fl + 1n; r <= 6n && f <= 6n; r++, f++) result |= (1n << (f + r * 8n));
    for (r = rk + 1n, f = fl - 1n; r <= 6n && f >= 1n; r++, f--) result |= (1n << (f + r * 8n));
    for (r = rk - 1n, f = fl + 1n; r >= 1n && f <= 6n; r--, f++) result |= (1n << (f + r * 8n));
    for (r = rk - 1n, f = fl - 1n; r >= 1n && f >= 1n; r--, f--) result |= (1n << (f + r * 8n));
    return result;
}
//https://www.chessprogramming.org/Looking_for_Magics



// // set occupancies
// export function set_occupancy(index, bits_in_mask,attack_mask)
// {
//     // occupancy map
//     let occupancy = 0n;
    
//     // loop over the range of bits within attack mask
//     for (let count = 0; count < bits_in_mask; count++)
//     {
//         // get LS1B index of attacks mask
//         int square = get_ls1b_index(attack_mask);
        
//         // pop LS1B in attack map
//         pop_bit(attack_mask, square);
        
//         // make sure occupancy is on board
//         if (index & (1 << count))
//             // populate occupancy map
//             occupancy |= (1n << square);
//     }
    
//     // return occupancy map
//     return occupancy;
// }

export function random_uint64() {
    var u1, u2, u3, u4;
    u1 = (Math.random()) & 0xFFFF; u2 = (Math.random()) & 0xFFFF;
    u3 = (Math.random()) & 0xFFFF; u4 = (Math.random()) & 0xFFFF;
    return BigInt(u1 | (u2 << 16) | (u3 << 32) | (u4 << 48));
  }
  
  export function random_uint64_fewbits() {
    return random_uint64() & random_uint64() & random_uint64();
  }

export function find_magic(square, relevant_bits, bishop) {
    
    // init occupancies
    let occupancies= [];
    
    // init attack tables
    let attacks = [];
    
    // init used attacks
    let used_attacks = [];
    
    // init attack mask for a current piece
    let attack_mask = bishop ? bMask(square) : rMask(square);
    
    // init occupancy indicies
    let occupancy_indicies = 1 << relevant_bits;
    
    // loop over occupancy indicies
    for (let index = 0; index < occupancy_indicies; index++)
    {
        // init occupancies
    //    occupancies[index] = set_occupancy(index, relevant_bits, attack_mask);
        
        // init attacks
        attacks[index] = bishop ? bishopAttacksOnTheFly(square, occupancies[index]) :
                                    rookAttacksOnTheFly(square, occupancies[index]);
    }
    
    // test magic numbers loop
    for (var random_count = 0; random_count < 100000000; random_count++)
    {
        // generate magic number candidate
        let magic_number = random_uint64_fewbits();
        
        // skip inappropriate magic numbers
        if (count_1s((attack_mask * magic_number) & 0xFF00000000000000n) < 6) continue;
        
        
        // init index & fail flag
        var index, fail;
        
        // test magic index loop
        for (index = 0, fail = 0; !fail && index < occupancy_indicies; index++)
        {
            // init magic index
            let magic_index = ((occupancies[index] * magic_number) >> (64n - relevant_bits));
            
            // if magic index works
            if (used_attacks[Number(magic_index)] == 0n)
                // init used attacks
                used_attacks[Number(magic_index)] = attacks[index];
            
            // otherwise
            else if (used_attacks[Number(magic_index)] != attacks[index])
                // magic index doesn't work
                fail = 1;
        }
        
        // if magic number works
        if (!fail)
            // return it
            return magic_number;
    }
    
    // if magic number doesn't work
    console.log("  Magic number fails!\n");
    return 0n;
}
//     uint64 mask, b[4096], a[4096], used[4096], magic;
//     int i, j, k, n, fail;
  
//     mask = bishop? bmask(sq) : rmask(sq);
//     n = count_1s(mask);
  
//     for(i = 0; i < (1 << n); i++) {
//       b[i] = index_to_uint64(i, n, mask);
//       a[i] = bishop? batt(sq, b[i]) : ratt(sq, b[i]);
//     }
//     for(k = 0; k < 100000000; k++) {
//       magic = random_uint64_fewbits();
//       if(count_1s((mask * magic) & 0xFF00000000000000n) < 6) continue;
//       for(i = 0; i < 4096; i++) used[i] = 0n;
//       for(i = 0, fail = 0; !fail && i < (1 << n); i++) {
//         j = transform(b[i], magic, m);
//         if(used[j] == 0n) used[j] = a[i];
//         else if(used[j] != a[i]) fail = 1;
//       }
//       if(!fail) return magic;
//     }
//     printf("***Failed***\n");
//     return 0n;
//   }
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