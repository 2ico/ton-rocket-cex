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

export type { Currency, CurrencyPair };