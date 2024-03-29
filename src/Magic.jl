module Magic


import Util

function initSlidersAttack(is_bishop)
    attacks = Array{Dict}(undef,64)
    for i in 1:64
        attacks[i] = Dict()
    end
    println("INITIALIZING SLIDER MOVES",is_bishop)
    for sq in 1:64
        attack_mask = (is_bishop) ? bMask(sq) : rMask(sq)
        relevant_bits_count = count_ones(attack_mask)
        occupancy_indicies = (1 << relevant_bits_count)
        for index in 0:occupancy_indicies-1
            if(is_bishop)
                occ = UInt128(setOcc(index,relevant_bits_count,attack_mask))
                magic_index = (occ * bishop_magic_numbers[sq]) >> (64 - n_b_bits[sq])
                attacks[sq][magic_index] = bishopAttacksOnTheFly(occ,sq)
            else
                occ = UInt128(setOcc(index,relevant_bits_count,attack_mask))
                magic_index = (occ * rook_magic_numbers[sq]) >> (64 - n_r_bits[sq]) 
                attacks[sq][magic_index] = rookAttacksOnTheFly(occ,sq)

            end
        end
    end
    return attacks
end


function bishopAttacksOnTheFly(occ,sq)
    if(sq < 1)
        return false
    end
    attacks = UInt64(0)
    piece_rank = (sq == 0) ? 0 : ceil(Int64,sq / 8 - 1)
    piece_file = (sq % 8) - 1
    piece_file = ((sq % 8) == 0) ? 7 : piece_file
    piece_rank = (piece_rank == 8) ? 7 : piece_rank
    
    rank = piece_rank + 1
    file = piece_file + 1
    while(rank < 8 && file < 8)
        attacks |= (1 << ((rank * 8) + file))
        if((1 << ((rank * 8) + file)) & occ > 0) break end
        file = file + 1
        rank = rank + 1
    end

    rank = piece_rank + 1
    file = piece_file - 1
    while(rank < 8 && file >= 0)
        attacks |= (1 << ((rank * 8) + file))
        if((1 << ((rank * 8) + file)) & occ > 0) break end
        file = file - 1
        rank = rank + 1
    end

    rank = piece_rank - 1
    file = piece_file + 1
    while(rank >= 0 && file < 8)
        attacks |= (1 << ((rank * 8) + file))
        if((1 << ((rank * 8) + file)) & occ > 0) break end
        file = file + 1
        rank = rank - 1
    end

    rank = piece_rank - 1
    file = piece_file - 1
    while(rank >= 0 && file >= 0)
        attacks |= (1 << ((rank * 8) + file))
        if((1 << ((rank * 8) + file)) & occ > 0 ) break end
        file = file - 1
        rank = rank - 1
    end
    return attacks
end


function rookAttacksOnTheFly(occ,sq)
    if(sq < 1)
        return false
    end
    attacks = UInt64(0)
    piece_rank = ceil(Int64,sq / 8 - 1) 
    piece_file = (sq % 8) - 1
    piece_file = ((sq % 8) == 0) ? 7 : piece_file
    piece_rank = (piece_rank == 8) ? 7 : piece_rank
    #ranks above
    for rank in (piece_rank+1):7
        attacks |= (1 << (rank * 8 + piece_file))
        if ((1 << (rank * 8 + piece_file)) & occ > 0) break end
    end

    #ranks below
    rank = piece_rank - 1
    while(rank >= 0)
        attacks |= (1 << ((rank * 8) + piece_file))
        if ((1 << (rank * 8 + piece_file)) & occ > 0 ) break end
        rank = rank - 1
    end

    #files to the right
    for file in (piece_file+1):7
        attacks |= (1 << ((piece_rank * 8) + file))
        if ((1 << (piece_rank * 8 + file)) & occ > 0 ) break end
    end
    
    #files to the left 
    file = piece_file - 1
    while(file >= 0)
        attacks |= (1 << (piece_rank * 8 + file))
        if ((1 << (piece_rank * 8 + file)) & occ > 0 ) break end
        file = file - 1
    end

    return attacks
end

n_r_bits =  [
	12, 11, 11, 11, 11, 11, 11, 12,
	11, 10, 10, 10, 10, 10, 10, 11,
	11, 10, 10, 10, 10, 10, 10, 11,
	11, 10, 10, 10, 10, 10, 10, 11,
	11, 10, 10, 10, 10, 10, 10, 11,
	11, 10, 10, 10, 10, 10, 10, 11,
	11, 10, 10, 10, 10, 10, 10, 11,
	12, 11, 11, 11, 11, 11, 11, 12
]

n_b_bits = [
	6, 5, 5, 5, 5, 5, 5, 6,
	5, 5, 5, 5, 5, 5, 5, 5,
	5, 5, 7, 7, 7, 7, 5, 5,
	5, 5, 7, 9, 9, 7, 5, 5,
	5, 5, 7, 9, 9, 7, 5, 5,
	5, 5, 7, 7, 7, 7, 5, 5,
	5, 5, 5, 5, 5, 5, 5, 5,
	6, 5, 5, 5, 5, 5, 5, 6
]

function rMask(sq)

    result = 0
    rank = ceil(Int64,sq / 8 - 1)
    file = sq % 8 - 1
    file = ((sq % 8 ) == 0) ? 7 : file
    rank = rank == 8 ? 7 : rank
    for index in rank+1:6
        result |= (1 << (file + (index * 8)))
    end
    index = rank - 1
    while index >= 1
        result |= (1 << (file + (index * 8)))
        index = index - 1
    end

    for index in file+1:6
        result |= (1 << (index + (rank * 8)))
    end

    index = file - 1
    while index >= 1 && index <= 64
        result |= (1 << (index + (rank * 8)))
        index = index - 1
    end
    return result

end


function bMask(sq)
    result = 0
    rank = ceil(UInt64,sq / 8 - 1)
    file = sq % 8 - 1
    file = ((sq % 8) == 0) ? 7 : file
    rank = rank == 8 ? 7 : rank
    # println(file, ' ', rank)
    r = rank + 1
    f = file + 1
    while(r < 7 && f < 7)
        result |= (1 << (f + (r * 8)))
        r = r + 1
        f = f + 1
    end

    r = rank + 1
    f = file - 1
    while(r < 7 && f >= 1)
        result |= (1 << (f + (r * 8)))
        r = r + 1
        f = f - 1
    end

    r = rank - 1
    f = file + 1
    while(r >= 1 && f < 7)
        result |= (1 << (f + (r * 8)))
        r = r - 1
        f = f + 1
    end

    r = rank - 1
    f = file - 1
    while(r >= 1 && f >= 1)
        result |= (1 << (f + (r * 8)))
        r = r - 1
        f = f - 1
    end
    return result
end

# https://www.chessprogramming.org/Looking_for_Magics

rook_magic_numbers = [
    0x8a80104000800020,
    0x140002000100040,
    0x2801880a0017001,
    0x100081001000420,
    0x200020010080420,
    0x3001c0002010008,
    0x8480008002000100,
    0x2080088004402900,
    0x800098204000,
    0x2024401000200040,
    0x100802000801000,
    0x120800800801000,
    0x208808088000400,
    0x2802200800400,
    0x2200800100020080,
    0x801000060821100,
    0x80044006422000,
    0x100808020004000,
    0x12108a0010204200,
    0x140848010000802,
    0x481828014002800,
    0x8094004002004100,
    0x4010040010010802,
    0x20008806104,
    0x100400080208000,
    0x2040002120081000,
    0x21200680100081,
    0x20100080080080,
    0x2000a00200410,
    0x20080800400,
    0x80088400100102,
    0x80004600042881,
    0x4040008040800020,
    0x440003000200801,
    0x4200011004500,
    0x188020010100100,
    0x14800401802800,
    0x2080040080800200,
    0x124080204001001,
    0x200046502000484,
    0x480400080088020,
    0x1000422010034000,
    0x30200100110040,
    0x100021010009,
    0x2002080100110004,
    0x202008004008002,
    0x20020004010100,
    0x2048440040820001,
    0x101002200408200,
    0x40802000401080,
    0x4008142004410100,
    0x2060820c0120200,
    0x1001004080100,
    0x20c020080040080,
    0x2935610830022400,
    0x44440041009200,
    0x280001040802101,
    0x2100190040002085,
    0x80c0084100102001,
    0x4024081001000421,
    0x20030a0244872,
    0x12001008414402,
    0x2006104900a0804,
    0x1004081002402
];

bishop_magic_numbers = [
    0x40040844404084,
    0x2004208a004208,
    0x10190041080202,
    0x108060845042010,
    0x581104180800210,
    0x2112080446200010,
    0x1080820820060210,
    0x3c0808410220200,
    0x4050404440404,
    0x21001420088,
    0x24d0080801082102,
    0x1020a0a020400,
    0x40308200402,
    0x4011002100800,
    0x401484104104005,
    0x801010402020200,
    0x400210c3880100,
    0x404022024108200,
    0x810018200204102,
    0x4002801a02003,
    0x85040820080400,
    0x810102c808880400,
    0xe900410884800,
    0x8002020480840102,
    0x220200865090201,
    0x2010100a02021202,
    0x152048408022401,
    0x20080002081110,
    0x4001001021004000,
    0x800040400a011002,
    0xe4004081011002,
    0x1c004001012080,
    0x8004200962a00220,
    0x8422100208500202,
    0x2000402200300c08,
    0x8646020080080080,
    0x80020a0200100808,
    0x2010004880111000,
    0x623000a080011400,
    0x42008c0340209202,
    0x209188240001000,
    0x400408a884001800,
    0x110400a6080400,
    0x1840060a44020800,
    0x90080104000041,
    0x201011000808101,
    0x1a2208080504f080,
    0x8012020600211212,
    0x500861011240000,
    0x180806108200800,
    0x4000020e01040044,
    0x300000261044000a,
    0x802241102020002,
    0x20906061210001,
    0x5a84841004010310,
    0x4010801011c04,
    0xa010109502200,
    0x4a02012000,
    0x500201010098b028,
    0x8040002811040900,
    0x28000010020204,
    0x6000020202d0240,
    0x8918844842082200,
    0x4010011029020020
];



function setOcc(index,bits_in_mask,attack_mask)
    # println(index, ' ',bits_in_mask, ' ', attack_mask)
    temp_occ = 0
    for count in 0:bits_in_mask-1
        square = Util.leastSignificantBit(attack_mask)
        attack_mask = Util.popBit(attack_mask,square)
        if((index & (1 << count)) > 0)
            temp_occ |= (1 << square)
        end
        #  println(count, ' ', square, ' ', attack_mask, ' ',temp_occ)
    end
    return temp_occ
end


end