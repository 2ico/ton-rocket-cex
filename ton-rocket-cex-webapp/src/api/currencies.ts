// Real fetch example
// const getAvailableCurrencies = async () => {
//     return await axios.get('https://pay.ton-rocket.com/currencies/available').then((response) => response.data)
//   };

import { AnyRecord } from "dns";

import Decimal from 'decimal.js';
import {Currency, CurrencyPair, Order, OrderAction, OrderType} from '@/api/types';
import { makeUrlPair } from "@/utils/utils";


const baseCurrencies: Array<Currency> = [
    {
        "currency": "TONCOIN",
        "name": "TON",
        "minTransfer": 0.00001,
        "minCheque": 0.005,
        "minInvoice": 0.001,
        "minWithdraw": 2,
        "feeWithdraw": {
            "fee": 0,
            "currency": "TONCOIN"
        }
    },
    {
        "currency": "SCALE",
        "name": "SCALE",
        "minTransfer": 0.00001,
        "minCheque": 5,
        "minInvoice": 0.001,
        "minWithdraw": 1e-9,
        "feeWithdraw": {
            "fee": 0.05,
            "currency": "TONCOIN"
        }
    },
    {
        "currency": "BOLT",
        "name": "BOLT",
        "minTransfer": 0.00001,
        "minCheque": 5,
        "minInvoice": 0.001,
        "minWithdraw": 1e-9,
        "feeWithdraw": {
            "fee": 0.05,
            "currency": "TONCOIN"
        }
    },
    {
        "currency": "TGR",
        "name": "TGR",
        "minTransfer": 0.00001,
        "minCheque": 0.05,
        "minInvoice": 0.001,
        "minWithdraw": 1e-9,
        "feeWithdraw": {
            "fee": 0.05,
            "currency": "TONCOIN"
        }
    },
    {
        "currency": "TIC",
        "name": "TIC",
        "minTransfer": 0.0001,
        "minCheque": 0.05,
        "minInvoice": 0.001,
        "minWithdraw": 1e-9,
        "feeWithdraw": {
            "fee": 0.05,
            "currency": "TONCOIN"
        }
    },
    {
        "currency": "TAKE",
        "name": "TAKE",
        "minTransfer": 0.0001,
        "minCheque": 0.05,
        "minInvoice": 0.001,
        "minWithdraw": 1e-9,
        "feeWithdraw": {
            "fee": 0.05,
            "currency": "TONCOIN"
        }
    },
    {
        "currency": "HEDGE",
        "name": "HEDGE",
        "minTransfer": 0.002,
        "minCheque": 1,
        "minInvoice": 0.001,
        "minWithdraw": 400,
        "feeWithdraw": {
            "fee": 0.05,
            "currency": "TONCOIN"
        }
    },
    {
        "currency": "KOTE",
        "name": "nKOTE",
        "minTransfer": 1,
        "minCheque": 4,
        "minInvoice": 1,
        "minWithdraw": 1,
        "feeWithdraw": {
            "fee": 0.05,
            "currency": "TONCOIN"
        }
    },
    {
        "currency": "TNX",
        "name": "TNX",
        "minTransfer": 0.0001,
        "minCheque": 0.05,
        "minInvoice": 0.001,
        "minWithdraw": 1e-9,
        "feeWithdraw": {
            "fee": 0.05,
            "currency": "TONCOIN"
        }
    }
];

const randomMarketPrice = (min: number, max: number) => Math.random() * (max - min) + min;
const randomPriceChange = (min: number, max: number) => Math.random() * (max - min) + min;

const availablePairs: Array<CurrencyPair> =
    [
        {
            "currency": "TONCOIN",
            "name": "TON",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "currency": "SCALE",
            "name": "SCALE",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "currency": "BOLT",
            "name": "BOLT",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "currency": "TGR",
            "name": "TGR",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "currency": "TIC",
            "name": "TIC",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "currency": "TAKE",
            "name": "TAKE",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "currency": "HEDGE",
            "name": "HEDGE",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "currency": "KOTE",
            "name": "nKOTE",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "currency": "TNX",
            "name": "TNX",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
    ]

const wrapWithTimeout = (results: any, error_message: string) => {
    return new Promise<any>((resolve, reject) => {
        if (!results) {
            return setTimeout(
                () => reject(new Error(error_message)),
                50
            );
        }

        setTimeout(() => resolve({
            "success": true,
            "data": {
                "results": results
            }
        }
        ), 150);
    })
}


function getAvailablePairs(baseCurrency: Currency) {
    if(baseCurrency === null)
        return wrapWithTimeout(null, "baseCurrency null")
    return wrapWithTimeout(availablePairs.filter((pair) => pair.currency != baseCurrency.currency), 'pairs not found');
}

function getBaseCurrencies() {
    return wrapWithTimeout(baseCurrencies, 'baseCurrencies not found');
};

type MarketState = {
    marketPrice: Decimal;
    precision: Decimal;
    buyers: {
        price: Decimal;
        amount: Decimal;
    }[];
    sellers: {
        price: Decimal;
        amount: Decimal;
    }[];
};

function marketGenerator(buyerNumber : number, sellerNumber : number) {
    const precision = new Decimal(0.01)
    const defaultMaxOffset = 8000
    const defaultMaxAmount = new Decimal(100)
    const defaultMaxMarketPrice = new Decimal(100)

    const randomAmount = (max: Decimal) => new Decimal(max.mul(Math.random()));
    const randomInteger = (max: number) => Math.floor(Math.random() * Math.random() * max + 1)

    function randomOrder(
        baseValue: Decimal, 
        sign: number, 
        precision: Decimal,
        maxOffset: number
    ) {
        return  {
            price: baseValue.add(precision.mul(randomInteger(maxOffset)).mul(sign)),
            amount : randomAmount(defaultMaxAmount)
        }
    }

    function* ordersGenerator(
        amount: number, 
        baseValue: Decimal, 
        sign: number,
        precision: Decimal,
        maxOffset: number
    ) {
            for (let i = 0; i < amount; i += 1) {
                yield randomOrder(baseValue, sign, precision, maxOffset)
        }
    }

    let marketGlobalState : { [pair: string] : MarketState } = { }

    const updateMarketState = (pair : string) => {
        if (pair in marketGlobalState) { 
            // update existing market pair            
            const marketPrice = marketGlobalState[pair].marketPrice
            const precision = marketGlobalState[pair].precision

            for (let i = 0; i < Math.sqrt(buyerNumber); i += 1) {
                const index = Math.floor(Math.random() * buyerNumber);
                marketGlobalState[pair].buyers[index] = 
                    randomOrder(marketPrice, -1, precision, defaultMaxOffset)                
            }

            for (let i = 0; i < Math.sqrt(sellerNumber); i += 1) {
                const index = Math.floor(Math.random() * sellerNumber);
                marketGlobalState[pair].sellers[index] = 
                    randomOrder(marketPrice, 1, precision, defaultMaxOffset)                
            }

        } else {
            // generate market pair
            const marketPrice = randomAmount(defaultMaxMarketPrice).add(
                precision.mul(defaultMaxOffset)).toNearest(precision)
            console.log(marketPrice.toNumber())
            marketGlobalState[pair] = {
                marketPrice: marketPrice,
                precision: precision,
                buyers : Array.from(ordersGenerator(buyerNumber, marketPrice, -1, precision, defaultMaxOffset)),
                sellers : Array.from(ordersGenerator(sellerNumber, marketPrice, 1, precision, defaultMaxOffset))
            }
        }

        // sort entries
        // todo: sorting buyers high to low may save a call to .reverse() later on
        const currentMarket = marketGlobalState[pair]
        currentMarket.buyers.sort((
            {price: lPrice, amount: lAmount}, {price: rPrice, amount: rAmount}) =>
                (lPrice.minus(rPrice)).toNumber())

        currentMarket.sellers.sort((
            {price: lPrice, amount: lAmount}, {price: rPrice, amount: rAmount}) =>
                (lPrice.minus(rPrice)).toNumber())

        return currentMarket
    }

    return updateMarketState
}

const myMarket = marketGenerator(100, 100)

function getOrderbook(baseCurrency: string, priceCurrency: string) {
    return wrapWithTimeout(
        myMarket(baseCurrency + "-" + priceCurrency),
        "orderbook not found")
}

function userOrders(orderCount: number) {
    // Pair format: TONCOIN_TAKE
    const precision = new Decimal(0.01) // currently not in the pair

    const randomDecimal = (max: Decimal) => new Decimal(max.mul(Math.random()));
    const takeSome = (source: Array<CurrencyPair>, count: number) => 
        source.sort(() => Math.random() - 0.5).slice(0, count)

    const makeOrder = (baseCurrecy: Currency, pair : CurrencyPair, price: Decimal) => ({
        baseCurrency: baseCurrecy,
        pair: pair,
        amount: randomDecimal(new Decimal(100)),
        price: price.toNearest(precision),
        orderAction: (price.greaterThan(pair.market_price)) ? OrderAction.Sell : OrderAction.Buy,
        orderType: (Math.random() > 0.5) ? OrderType.Limit : OrderType.Market
    })
    
    let userOrders : Order[] = [];

    for (let i = 0; i < orderCount / 4; ++i) {
        const baseCurrency = baseCurrencies[Math.floor(Math.random() * baseCurrencies.length)]
        userOrders.push(...takeSome(availablePairs.filter((pair) => pair.currency != baseCurrency.currency), 4).map(
            (pair) => makeOrder(baseCurrency, pair, new Decimal(pair.market_price + (Math.random() - 0.5) * 2))
        ))
    }

    return userOrders
}

export { getBaseCurrencies, getAvailablePairs, getOrderbook };
export type { MarketState };