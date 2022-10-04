// Real fetch example
// const getAvailableCurrencies = async () => {
//     return await axios.get('https://pay.ton-rocket.com/currencies/available').then((response) => response.data)
//   };

import { AnyRecord } from "dns";

import {Currency, CurrencyPair} from '@/api/types';

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

function getOrderbook(baseCurrency: string, priceCurrency: string) {
    const marketPrice = randomMarketPrice(0.420, 6.9)
    const randomAmount = (max: number) => Math.random() * max;

    function* monotonicRandomIterator(end : number, startValue = 0.0, maxStep = 0.0, sign=1) {
        for (let i = 0; i < end; i += 1) {
            startValue += randomAmount(maxStep) * sign
            yield startValue
        }
    }
    const buyerPrice = monotonicRandomIterator(10, marketPrice, 0.05, -1)
    const sellerPrice = monotonicRandomIterator(10, marketPrice, 0.05, 1)
    
    return wrapWithTimeout({
        "marketPrice" : marketPrice,
        "buyers" : Array.from(buyerPrice, (p) => ({"price:" : p, "amount": randomAmount(10)})),
        "sellers" : Array.from(sellerPrice, (p) => ({"price:" : p, "amount": randomAmount(10)})),
    }, "orderbook not found")
}

// ratesCurrencies(pair) {
//     url = "/currencies/rate"

// }


export { getBaseCurrencies, getAvailablePairs, getOrderbook };