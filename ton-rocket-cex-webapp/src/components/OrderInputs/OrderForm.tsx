import { useState, useEffect } from 'react';

import Decimal from 'decimal.js';
import AmountSelector from '@/components/OrderInputs/AmountSelector';
import PriceSelector from '@/components/OrderInputs/PriceSelector'
import { Currency } from '@/api/types';
import Box from '@mui/material/Box';

import { OrderAction, ToggleBuySell } from '@/components/OrderInputs/ToggleBuySell';
import { OrderType, OrderSelector } from '@/components/OrderInputs/OrderTypeSelector'
import { Grid, Typography } from '@mui/material';
import "@/components/OrderInputs/OrderInputs.css"

type Order = {
    price: Decimal,
    amount: Decimal,
    orderType: OrderType
    orderAction: OrderAction
};

type Props = {
    totalUserAmount: Decimal
    baseCurrency: Currency,
    quoteCurrency: Currency,
    marketPrice: Decimal,
    orderbookPrice: Decimal,
    orderbookOrderAction: OrderAction,
    onChange: (orderState: Order, isOrderValid: boolean) => void,
};

const OrderForm = ({ baseCurrency, quoteCurrency, orderbookPrice, totalUserAmount,
        orderbookOrderAction, marketPrice, onChange }: Props)
    : JSX.Element => {
    // const [amount, setAmount] = useState(0.0)
    const [[amount, isAmountValid], setAmountState] = useState([new Decimal(0.0), false])
    const [[price, isPriceValid], setPriceState] = useState([marketPrice, true])
    const [orderAction, setOrderAction] = useState(orderbookOrderAction)
    const [orderType, setOrderType] = useState(OrderType.Limit)

    const handleOrderTypeChange = (newOrderType: OrderType) => {
        setOrderType(newOrderType)
        if (newOrderType == OrderType.Market)
            setPriceState([marketPrice, true])
    }

    // useEffect(() => {
    //     if (!orderIssued) return
    //     handleIssueOrder({ price, amount, orderType, orderAction },
    //         isPriceValid && isAmountValid)
    // }, [orderIssued])

    useEffect(
        () => { onChange({ price, amount, orderType, orderAction }, isPriceValid && isAmountValid) }
    , [price, isPriceValid, amount, isAmountValid, orderType, orderAction])

    useEffect(() => {
        if (orderbookPrice.equals(0)) return;
        setPriceState([orderbookPrice, true])
        setOrderAction(orderbookOrderAction)
        setOrderType(OrderType.Limit)
    }, [orderbookPrice, orderbookOrderAction])

    return (
        <Grid container direction={"column"} spacing={2}
            sx={{
                maxWidth: 480,
                paddingRight: 2,
            }}
        >   
            <Grid item>
                <Grid container maxWidth={"360px"} spacing={2} alignItems={'flex-end'}>
                    <Grid item flex={1}><ToggleBuySell currentValue={orderAction} onChange={setOrderAction} /></Grid>
                    <Grid item flex={0}><OrderSelector currentOrderType={orderType} onChange={handleOrderTypeChange} /></Grid>
                </Grid>
            </Grid>
            <Grid item>
            <PriceSelector
                priceState={[price, isPriceValid]}
                onChange={setPriceState}
                isDisabled={orderType === OrderType.Market}
                amountType={quoteCurrency.name}
                precision={new Decimal(quoteCurrency.precision)}
            />
            </Grid>
            <Grid item>
            <AmountSelector
                amountState={[amount, isAmountValid]}
                price={price}
                onChange={setAmountState}
                totalUserQuote={totalUserAmount}
                baseCurrency={baseCurrency}
                quoteCurrency={quoteCurrency}
            />
            </Grid>
        </Grid>
    )
}

export { OrderForm };
export type { Order };