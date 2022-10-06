import {useLocation} from 'react-router-dom';
import Decimal from 'decimal.js';


import {Order, OrderForm} from '@/components/OrderForm';
import {getOrderbook} from "@/api/currencies";
import {Currency} from "@/api/types"
import { useQuery } from 'react-query';

import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useNavigate, useParams } from 'react-router-dom';
import { separateUrlPair } from "@/utils/utils"
import { Box, Typography } from '@mui/material';
import telegramHooks from '@/hooks/telegram';
import { useEffect, useState } from 'react';
import Orderbook from '@/components/Orderbook';

const baseCurrencyTmp : Currency = {
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
}

const tradeCurrencyTmp : Currency = {
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
}

const totalTmp = new Decimal(100.0)


export default function Trade() {
    const { pair } = useParams();
    const navigate = useNavigate();
    
    // const location = useLocation();
    // location.state.test

    const [isValidOrder, setIsValidOrder] = useState(false);
    
    const [orderIssued, setOrderIssued] = useState(false);
    const [firstUse, setFirstUse] = useState(true)

    const {isReady, telegram} = telegramHooks();

    if(pair == null) return (<div>Pair not specified</div>); //TODO make proper error component
    
    // TODO? pass pair via useLocation together with market price etc (already at hand in Currency.tsx)
    const { baseCurrency, tradeCurrency } = separateUrlPair(pair)

    //TODO onClose show confirm popup (see DurgerKing)

    useEffect(() => {
        if(!isReady) return
        // @ts-ignore
        telegram.BackButton.onClick(() => navigate("/"));
        // @ts-ignore
        telegram.BackButton.show();

        telegram.MainButton.setParams({
            color: "rgb(49, 181, 69)",
            text: "PLACE ORDER",
            is_visible: true,
            is_active: false,
          });
      }, [telegram, isReady]);

      useEffect(() => {
        if(!isReady) return

        if(isValidOrder){
            telegram.MainButton.onClick(() => {
                // @ts-ignore
                telegram.showPopup({title: "Order details", message: "TODO"})
            })
            telegram.MainButton.enable()
        }else{
            telegram.MainButton.disable();
        }
      }, [isValidOrder, telegram, isReady]);
    
    const { data, error, isLoading } = useQuery("orderBook", 
        () => getOrderbook(baseCurrency, tradeCurrency), {
        onSuccess: (data) => {
            // console.log(data.data.results)
            // let baseCurrencies = data.data.results;
            // setBaseCurrency(baseCurrencies[0]);
        },
        refetchInterval: 5000, 
    });

    if (isLoading) 
        return (
            <Backdrop open sx={{ color: '#fff', zIndex: (theme: { zIndex: { drawer: number; }; }) => theme.zIndex.drawer + 1 }} >
            <CircularProgress color="inherit" />
            </Backdrop>
        );
    else if (error) 
        return <div>Error loading orderbook</div>;
   
    
    const result = data.data.results
    const tradePrice = result.marketPrice //data.results["marketPrice"] // data["marketPrice"]    

    const handleIssueOrder = ({price, amount, orderType, orderAction} : Order, isOrderValid : boolean) => { 
        if (isOrderValid) {
            console.log(price, amount, orderAction.toString(), orderAction.toString(), isOrderValid) 
        }
        else 
            setOrderIssued(false)
            setFirstUse(false)
    }

    return (
        <Box>
        <Typography variant="h4">
            {baseCurrency}/{tradeCurrency}
        </Typography>
        <button onClick={() => setOrderIssued(true)}> PLACE ORDER </button>
        <Orderbook/>
        <hr/>
        <OrderForm 
            baseCurrency={baseCurrency} 
            priceCurrency={tradeCurrency} 
            totalAmout={totalTmp} 
            defaultPrice={tradePrice}
            handleIssueOrder = {handleIssueOrder}
            orderIssued = {orderIssued}
            firstUse = {firstUse}
            setFirstUse = {setFirstUse}
        />
        </Box>
    )
}