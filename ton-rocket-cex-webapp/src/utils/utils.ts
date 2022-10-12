function separateUrlPair(pair: string){
    let splits = pair.split('_')
    return {"baseCurrency": splits[0], "quoteCurrency": splits[1]}
}

function makeUrlPair(baseCurrency: string, quoteCurrency: string){
    return encodeURIComponent(baseCurrency +"_"+ quoteCurrency)
}


export { separateUrlPair, makeUrlPair }