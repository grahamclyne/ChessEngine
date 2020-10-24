

export function isKingCheck(king,oppattack){
    if((king & oppattack) > 0n){
        return true
    }
    return false
}