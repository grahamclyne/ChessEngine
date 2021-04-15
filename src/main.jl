include("moves.jl")
include("magic.jl")
include("game.jl")
include("search.jl")
using Profile
using PProf
using Traceur
board = startPositions()
colour = 'W'

global bishop_attacks = initSlidersAttack(true)
global rook_attacks = initSlidersAttack(false)

# rookMoves(0,sq)
# @time rookMoves(0,sq)
# @time rMask(sq)

# occ = reduce((x,y) -> x | y, values(board))
# getMovesUCI(board,'W',[],true)
# @time getMovesUCI(board,'W',[],true)
# makeMoveUCI("e2e4",board,'W')
# x = @time makeMoveUCI("e2e4",board,'W')
# prettyPrintBoard(x)
# root = Dict( "board"=> board, "weight"=> 0, "move"=> [], "children"=> [] )
# minimax(root, 5, colour, -Inf, Inf, [])
# @time minimax(root, 5, colour, -Inf, Inf, [])
# @trace getMovesUCI(board,'W',[],false)
# printBB(bishopMoves(occ,59))
# printBB(bishopAttacksOnTheFly(occ,59))
# printBB(bMask(59))
# prettyPrintBoard(board)
# printBB(board["BR"])
 play(board,colour,[])
#println(bMask(41))
# x = bishopMoves(17501020044661911169,41)
# printBB(x)
#printBB(bMask(41))
# println(bishop_attacks[41])
# for i in bishop_attacks[41]
#     println(i[1])
#     printBB(i[1])
#     println(i[2])
#     printBB(i[2])
#     println()
# end
# root = Node(0,1,[],0,0,"",board)
# tree = @time buildTree(root,colour,3)
# @time buildTree(root,colour,4)
#printTree(tree,0)
#@pprof buildTree(board,colour,1,[])

# attack_mask = bMask(41)
# relevant_bits_count = count_ones(attack_mask)
# println(relevant_bits_count)
# occupancy_indicies = (1 << relevant_bits_count)
# sq = 41
# for i in 0:9
#     println()
#     println()
#     occ = UInt128(setOcc(i,relevant_bits_count,attack_mask))
#     println(attack_mask)
#     printBB(attack_mask)
#     println(relevant_bits_count)
#     println(occ)
#     magic_index = (occ * bishop_magic_numbers[sq]) >> (64 - n_b_bits[sq])
#     printBB(bishopAttacksOnTheFly(occ,sq))
#     println(occ, ' ',bishop_magic_numbers[41], ' ', occ * bishop_magic_numbers[sq])
# end
    # console.log(attack_mask)
    #             printBitSet(attack_mask)
    #             console.log(relevant_bits_count)
    #             console.log(occupancy)
    #             let magic_index = (occupancy * magic.bishop_magic_numbers[40]) >> (64n - BigInt(magic.nBBits[40]));
    #             printBitSet(magic.bishopAttacksOnTheFly(occupancy,40))
    #             console.log(occupancy, ' ', magic.bishop_magic_numbers[40], ' ', occupancy * magic.bishop_magic_numbers[40])
        
    #         }