import { useState, useEffect } from 'react';

import Decimal from 'decimal.js';
import AmountSelector from '@/components/OrderInputs/AmountSelector';
import PriceSelector from '@/components/OrderInputs/PriceSelector'
import Box from '@mui/material/Box';

import { OrderAction, ToggleBuySell } from '@/components/OrderInputs/ToggleBuySell';
import { OrderType, OrderSelector } from '@/components/OrderInputs/OrderTypeSelector'

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
    orderbookPrice: Decimal,
    orderbookOrderAction: OrderAction,
    handleIssueOrder: (orderState: Order, isOrderValid: boolean) => void,
    orderIssued: boolean
    firstUse: boolean,
    setFirstUse: React.Dispatch<React.SetStateAction<boolean>>
};

const OrderForm = ({ totalAmount: totalAmount, baseCurrency, priceCurrency, orderbookPrice, orderbookOrderAction, precision, handleIssueOrder, orderIssued, firstUse, setFirstUse }: Props)
    : JSX.Element => {
    // const [amount, setAmount] = useState(0.0)
    const [[amount, isAmountValid], setAmountState] = useState([new Decimal(0.0), false])
    const [[price, isPriceValid], setPriceState] = useState([orderbookPrice, true])
    const [orderAction, setOrderAction] = useState(orderbookOrderAction)
    const [orderType, setOrderType] = useState(OrderType.Limit)

    const handleOrderTypeChange = (newOrderType: OrderType) => {
        setOrderType(newOrderType)
        if (newOrderType == OrderType.Market)
            setPriceState([orderbookPrice, true])
    }

    useEffect(() => {
        if (!orderIssued) return
        handleIssueOrder({ price, amount, orderType, orderAction },
            isPriceValid && isAmountValid)
    }, [orderIssued])

    useEffect(() => {
        setPriceState([orderbookPrice, true])
        setOrderAction(orderbookOrderAction)
    }, [orderbookPrice, orderbookOrderAction])

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
                precision={precision}
            />

            <AmountSelector
                amountState={[amount, isAmountValid]}
                setAmountState={setAmountState}
                totalAmount={totalAmount}
                amountType={priceCurrency}
                firstUse={firstUse}
                setFirstUse={setFirstUse}
            />
        </Box>
    )
}

export { OrderForm };
export type { Order };