function separateUrlPair(pair: string){
    let splits = pair.split('_')
    return {"baseCurrency": splits[0], "tradeCurrency": splits[1]}
}

function makeUrlPair(baseCurrency: string, tradeCurrency: string){
    return encodeURIComponent(baseCurrency +"_"+ tradeCurrency)
}


export { separateUrlPair, makeUrlPair }