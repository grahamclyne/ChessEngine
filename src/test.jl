using Test
include("util.jl")
include("magic.jl")


@testset "MAGIC" verbose=true begin
@test rookAttacksOnTheFly(0,1) == parse(UInt64,
"00000001"*
"00000001"*
"00000001"*
"00000001"*
"00000001"*
"00000001"*
"00000001"*
"11111110",base=2)

@test rookAttacksOnTheFly(0,64) == parse(UInt64,
"01111111"*
"10000000"*
"10000000"*
"10000000"*
"10000000"*
"10000000"*
"10000000"*
"10000000",base=2)

@test bishopAttacksOnTheFly(0,1) == parse(UInt128,
"10000000"*
"01000000"*
"00100000"*
"00010000"*
"00001000"*
"00000100"*
"00000010"*
"00000000",base=2)

@test bishopAttacksOnTheFly(0,64) == parse(UInt128,
"00000000"*
"01000000"*
"00100000"*
"00010000"*
"00001000"*
"00000100"*
"00000010"*
"00000001",base=2)
end

@testset "CHECK/CHECKMATE LOGIC" verbose = true begin
    
end