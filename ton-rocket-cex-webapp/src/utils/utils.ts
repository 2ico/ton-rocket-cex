import { Order, OrderAction, OrderType } from "@/api/types"
import { generateParamsProps } from "@/utils/types"

function separateUrlPair(pair: string){
    let splits = pair.split('_')
    return {"baseCurrency": splits[0], "quoteCurrency": splits[1]}
}

function makeUrlPair(baseCurrency: string, quoteCurrency: string){
    return encodeURIComponent(baseCurrency +"_"+ quoteCurrency)
}


function formatPriceChange(n: number){
    return (n<0?"":"+") + n.toFixed(2) + "%"
}

function generateParams ({
    baseCurrency = null, 
    quoteCurrency = null, 
    currency = null, 
    type = null, 
    action = null
} : generateParamsProps) {
    const param = [baseCurrency, quoteCurrency, currency, type, action]
    const queryParam = ["BASE", "QUOTE", "CURRENCY", "TYPE", "ACTION"]
        .map((k, i) => [k, param[i]] as [string, string]) // zip
        .filter(([f, v] : [string, string]) => v !== null)
        .map(([f, v] : [string, string]) => `${f}=${v}`)
        .join('&')
    return queryParam.length > 0 ? '?' + queryParam : ""
}

const filterLabels = {
    "BASE": (name: string) => `Base currency.: ${name}`,
    "QUOTE": (name: string) => `Quote currency: ${name}`,
    "CURRENCY": (name: string) => `Currency: ${name}`,
    "TYPE": (name: string) => `${name}`,
    "ACTION": (name: string) => `${name}`,
}

const filterFunctions = {
    "BASE": (name: string) => 
        ((order: Order) => order.pair.base_currency === name),
    "QUOTE": (name: string) => 
        ((order: Order) => order.pair.quote_currency === name),
    "CURRENCY": (name: string) => 
        ((order: Order) => filterFunctions["BASE"](name)(order) || filterFunctions["QUOTE"](name)(order)),
    "TYPE": (type: string) => 
        ((order: Order) => order.orderType === (type === "Limit" ? OrderType.Limit : OrderType.Market)),
    "ACTION": (action: string) => 
        ((order: Order) => order.orderAction === (action === "Buy" ? OrderAction.Buy : OrderAction.Sell))
}

export { separateUrlPair, makeUrlPair, formatPriceChange, generateParams, filterLabels, filterFunctions}