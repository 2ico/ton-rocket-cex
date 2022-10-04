import { useState } from 'react';

import AmountSelector from './OrderInputs/AmoutSelector';
import PriceSelector from './OrderInputs/PriceSelector';
import Box from '@mui/material/Box';

import {OrderAction, ToggleBuySell} from './OrderInputs/ToggleBuySell';
import {OrderType, OrderSelector} from './OrderInputs/OrderTypeSelector'

type Order = {
    price: number,
    amount: number,
    orderType: OrderType
    orderAction: OrderAction
};

type Props = {
    totalAmout: number
    baseCurrency: string,
    priceCurrency: string,
    defaultPrice: number,
    issueOrder: (orderState: Order) => void
};

const OrderForm = ({totalAmout, baseCurrency, 
    priceCurrency, defaultPrice, issueOrder} : Props) 
    : JSX.Element => 
{
    const [amount, setAmount] = useState(0.0)
    const [price, setPrice] = useState(0.0)
    const [orderAction, setOrderAction] = useState(OrderAction.Buy)
    const [orderType, setOrderType] = useState(OrderType.Limit)

    return (
        <Box
            sx={{
                maxWidth: 480,
                m: 3
            }}
        >
            <Box>
            <ToggleBuySell currentValue={orderAction} handleChange={setOrderAction} />
            <OrderSelector currentOrderType={orderType} handleChange={setOrderType} />
            </Box>

            <PriceSelector
                amount={price}
                setAmount={setPrice}
                isDisabled={orderType === OrderType.Market}
                defaultPrice={defaultPrice}
                defaultText={orderType !== OrderType.Market ? "0" : "Market"}
                amountType={priceCurrency}
            />

            <AmountSelector
                amount={amount}
                setAmount={setAmount}
                totalAmount={totalAmout} 
                amountType={priceCurrency}
            />
        </Box>
    )
}

export {OrderForm};
export type {Order};
