import { useState, useEffect } from 'react';

import Decimal from 'decimal.js';
import AmountSelector from '@/components/OrderInputs/AmountSelector';
import PriceSelector from '@/components/OrderInputs/PriceSelector'
import Box from '@mui/material/Box';

import { OrderAction, ToggleBuySell } from '@/components/OrderInputs/ToggleBuySell';
import { OrderType, OrderSelector } from '@/components/OrderInputs/OrderTypeSelector'
import { Typography } from '@mui/material';

type Order = {
    price: Decimal,
    amount: Decimal,
    orderType: OrderType
    orderAction: OrderAction
};

type Props = {
    totalAmount: Decimal
    baseCurrency: string,
    priceCurrency: string,
    precision: Decimal,
    defaultPrice: Decimal,
    orderbookPrice: Decimal,
    orderbookOrderAction: OrderAction,
    onChange: (orderState: Order, isOrderValid: boolean) => void,
};

const OrderForm = ({ totalAmount, baseCurrency, priceCurrency, orderbookPrice, 
        orderbookOrderAction, precision, defaultPrice, onChange }: Props)
    : JSX.Element => {
    // const [amount, setAmount] = useState(0.0)
    const [[amount, isAmountValid], setAmountState] = useState([new Decimal(0.0), false])
    const [[price, isPriceValid], setPriceState] = useState([defaultPrice, true])
    const [orderAction, setOrderAction] = useState(orderbookOrderAction)
    const [orderType, setOrderType] = useState(OrderType.Limit)

    const handleOrderTypeChange = (newOrderType: OrderType) => {
        setOrderType(newOrderType)
        if (newOrderType == OrderType.Market)
            setPriceState([defaultPrice, true])
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
    }, [orderbookPrice, orderbookOrderAction])

    return (
        <Box
            sx={{
                maxWidth: 480,
            }}
        >   
            <Box>
                <ToggleBuySell currentValue={orderAction} onChange={setOrderAction} />
                <OrderSelector currentOrderType={orderType} onChange={handleOrderTypeChange} />
            </Box>

            <PriceSelector
                priceState={[price, isPriceValid]}
                onChange={setPriceState}
                isDisabled={orderType === OrderType.Market}
                amountType={priceCurrency}
                precision={precision}
            />

            <AmountSelector
                amountState={[amount, isAmountValid]}
                onChange={setAmountState}
                totalAmount={totalAmount}
                amountType={priceCurrency}
            />
        </Box>
    )
}

export { OrderForm };
export type { Order };