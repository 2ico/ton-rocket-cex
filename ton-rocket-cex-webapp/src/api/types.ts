import Decimal from 'decimal.js';

type Currency = {
    "currency": string,
    "name": string,
    "minTransfer": number,
    "minCheque": number,
    "minInvoice": number,
    "minWithdraw": number,
    "feeWithdraw": {
        "fee": number,
        "currency": string
    }
};

type CurrencyPair =   {
    "currency": string,
    "name": string,
    "market_price": number,
    "change_daily": number,
    "change_weekly": number,
};

enum OrderType {
    Market = "Market",
    Limit = "Limit"
}

enum OrderAction {
    Buy = "Buy",
    Sell = "Sell"
}

type Order = {
    baseCurrency: Currency,
    pair: CurrencyPair,
    amount: Decimal,
    price: Decimal,
    orderAction: OrderAction,
    orderType: OrderType
}

export { OrderType, OrderAction }
export type { Currency, CurrencyPair, Order };