// Real fetch example
// const getAvailableCurrencies = async () => {
//     return await axios.get('https://pay.ton-rocket.com/currencies/available').then((response) => response.data)
//   };

import { AnyRecord } from "dns";

import Decimal from 'decimal.js';
import {Currency, CurrencyPair, Order, OrderAction, OrderType} from '@/api/types';
import { makeUrlPair } from "@/utils/utils";
import { CurrencyBitcoin } from "@mui/icons-material";

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
        },
        "precision": 1e-3
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
        },
        "precision": 1e-4
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
        },
        "precision": 1e-2
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
        },
        "precision": 1e-3
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
        },
        "precision": 1e-4
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
        },
        "precision": 1e-2
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
        },
        "precision": 1e-2
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
        },
        "precision": 1e-3
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
        },
        "precision": 1e-4
    }
];

const randomMarketPrice = (min: number, max: number) => Math.random() * (max - min) + min;
const randomPriceChange = (min: number, max: number) => Math.random() * (max - min) + min;

const availablePairs_incomplete: Array<any> =
    [
        {
            "base_currency": "TONCOIN",
            "base_name": "TON",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "base_currency": "SCALE",
            "base_name": "SCALE",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "base_currency": "BOLT",
            "base_name": "BOLT",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "base_currency": "TGR",
            "base_name": "TGR",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "base_currency": "TIC",
            "base_name": "TIC",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "base_currency": "TAKE",
            "base_name": "TAKE",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "base_currency": "HEDGE",
            "base_name": "HEDGE",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "base_currency": "KOTE",
            "base_name": "nKOTE",
            "market_price": randomMarketPrice(0.1, 1.0),
            "change_daily": randomPriceChange(-0.5, 0.5),
            "change_weekly": randomPriceChange(-0.1, 0.1),
        },
        {
            "base_currency": "TNX",
            "base_name": "TNX",
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


function getAvailablePairs(quoteCurrencies: Currency[]) {
    if(quoteCurrencies === null)
        return wrapWithTimeout(null, "quoteCurrency null")
    let result = quoteCurrencies.flatMap((quoteCurrency: Currency) => {
        return availablePairs_incomplete.filter((pair) => pair.base_currency != quoteCurrency.currency).map(
            pair => ({...pair, "quote_currency": quoteCurrency.currency, "quote_name": quoteCurrency.name})
        )
    })
    return wrapWithTimeout(result, 'pairs not found');
}

function getBaseCurrencies() {
    return wrapWithTimeout(baseCurrencies, 'baseCurrencies not found');
};

function getPairInfo(baseCurrency: string, quoteCurrency: string) {
    return wrapWithTimeout({
        base: baseCurrencies[baseCurrencies.findIndex((currency) => currency.currency === baseCurrency)],
        quote: baseCurrencies[baseCurrencies.findIndex((currency) => currency.currency === quoteCurrency)],
        pair: availablePairs_incomplete.filter((pair) => pair.base_currency == baseCurrency)[0]
    }, "pair info not found")
}

type MarketState = {
    marketPrice: Decimal;
    quotePrecision: Decimal;
    basePrecision: Decimal;
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

    const updateMarketState = (baseCurrency: string, quoteCurrency : string) => {
        const quotePrecision = new Decimal(baseCurrencies[baseCurrencies.findIndex(
            (currency) => currency.currency == quoteCurrency)].precision)
        const basePrecision = new Decimal(baseCurrencies[baseCurrencies.findIndex(
            (currency) => currency.currency == baseCurrency)].precision)

        const pair = baseCurrency + "_" + quoteCurrency
        console.log(pair, quotePrecision.toNumber(), basePrecision.toNumber())
        if (pair in marketGlobalState) { 
            // update existing market pair            
            const marketPrice = marketGlobalState[pair].marketPrice

            for (let i = 0; i < Math.sqrt(buyerNumber); i += 1) {
                const index = Math.floor(Math.random() * buyerNumber);
                marketGlobalState[pair].buyers[index] = 
                    randomOrder(marketPrice, -1, quotePrecision, defaultMaxOffset)                
            }

            for (let i = 0; i < Math.sqrt(sellerNumber); i += 1) {
                const index = Math.floor(Math.random() * sellerNumber);
                marketGlobalState[pair].sellers[index] = 
                    randomOrder(marketPrice, 1, quotePrecision, defaultMaxOffset)                
            }

        } else {
            // generate market pair
            const marketPrice = randomAmount(defaultMaxMarketPrice).add(
                quotePrecision.mul(defaultMaxOffset)).toNearest(quotePrecision)
            console.log(marketPrice.toNumber())
            marketGlobalState[pair] = {
                marketPrice: marketPrice,
                quotePrecision: quotePrecision,
                basePrecision: basePrecision,
                buyers : Array.from(ordersGenerator(buyerNumber, marketPrice, -1, quotePrecision, defaultMaxOffset)),
                sellers : Array.from(ordersGenerator(sellerNumber, marketPrice, 1, quotePrecision, defaultMaxOffset))
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

function getOrderbook(baseCurrency: string, quoteCurrency: string) {
    return wrapWithTimeout(
        myMarket(baseCurrency, quoteCurrency),
        "orderbook not found")
}

function generateUserOrder (orderCount: number) {
    // Pair format: TONCOIN_TAKE
    const precision = new Decimal(0.01) // currently not in the pair

    const randomDecimal = (max: Decimal) => new Decimal(max.mul(Math.random()));
    const takeSome = (source: Array<CurrencyPair>, count: number) => 
        source.sort(() => Math.random() - 0.5).slice(0, count)

    let orderId = 0

    const makeOrder = (pair : CurrencyPair, price: Decimal) => ({
        id: orderId += 1,
        pair: pair,
        amount: randomDecimal(new Decimal(100)),
        price: price.toNearest(precision),
        orderAction: (price.greaterThan(pair.market_price)) ? OrderAction.Sell : OrderAction.Buy,
        orderType: (Math.random() > 0.5) ? OrderType.Limit : OrderType.Market
    })
    
    let userOrders : Order[] = [];

    for (let i = 0; i < orderCount / 4; ++i) {
        const quoteCurrency = baseCurrencies[Math.floor(Math.random() * baseCurrencies.length)]
        userOrders.push(...takeSome(availablePairs_incomplete.filter((pair) => pair.base_currency !== quoteCurrency.currency), 4)          
            .map((pair) => ({...pair, "quote_currency": quoteCurrency.currency, "quote_name": quoteCurrency.name}))
            .map((pair) => makeOrder(pair, new Decimal(pair.market_price * (0.5 + Math.random())))))
    }

    return userOrders
}

const userOrders = generateUserOrder(120)

function getUserOrders() {
    return wrapWithTimeout(userOrders, 'user order not retrived');
}

export { getBaseCurrencies, getAvailablePairs, getOrderbook, getUserOrders, getPairInfo };
export type { MarketState };