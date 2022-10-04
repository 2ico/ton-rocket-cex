import { useState } from 'react';

import AmountSelector from '@/components/OrderInputs/AmoutSelector';
import PriceSelector from '@/components/OrderInputs/PriceSelector';
import Box from '@mui/material/Box';

import {OrderAction, ToggleBuySell} from '@/components/OrderInputs/ToggleBuySell';
import {OrderType, OrderSelector} from '@/components/OrderInputs/OrderTypeSelector'

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
    // const [amount, setAmount] = useState(0.0)
    const [[amount, isAmountValid], setAmountState] = useState([0.0, true])
    const [[price, isPriceValid], setPriceState] = useState([defaultPrice, true])
    const [orderAction, setOrderAction] = useState(OrderAction.Buy)
    const [orderType, setOrderType] = useState(OrderType.Limit)
 
    const handleOrderTypeChange = (newOrderType : OrderType) => {
        setOrderType(newOrderType)
        if(newOrderType == OrderType.Market) 
            setPriceState([defaultPrice, true])
    }

    return (
        <Box
            sx={{
                maxWidth: 480,
                m: 3
            }}
        >
            <div>
            <ToggleBuySell currentValue={orderAction} handleChange={setOrderAction} />
            <OrderSelector currentOrderType={orderType} handleChange={handleOrderTypeChange} />
            </div>

            <PriceSelector
                priceState={[price, isPriceValid]}
                setPriceState={setPriceState}
                isDisabled={orderType === OrderType.Market}
                amountType={priceCurrency}
            />

            <AmountSelector
                amountState={[amount, isAmountValid]}
                setAmountState={setAmountState}
                totalAmount={totalAmout} 
                amountType={priceCurrency}
            />
        </Box>
    )
}

export {OrderForm};
export type {Order};