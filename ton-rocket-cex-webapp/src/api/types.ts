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
    },
    "precision": number
};

type CurrencyPair =   {
    "base_currency": string,
    "base_name": string,
    "quote_currency": string,
    "quote_name": string,
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
    id: number,
    pair: CurrencyPair,
    amount: Decimal,
    price: Decimal,
    orderAction: OrderAction,
    orderType: OrderType
}

export {OrderAction, OrderType};
export type { Currency, CurrencyPair, Order};