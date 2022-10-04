import {OrderForm} from '@/components/OrderForm';
import {getOrderbook} from "@/api/currencies";
import {Currency} from "@/api/types"
import { useQuery } from 'react-query';

import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useParams } from 'react-router-dom';
import { separateUrlPair } from "@/utils/utils"
import { Box, Typography } from '@mui/material';
import telegramHooks from '@/hooks/telegram';
import { useEffect } from 'react';

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

export default function Trade() {
    const { pair } = useParams();
    const {isReady, telegram} = telegramHooks();

    if(pair == null) return (<div>Pair not specified</div>); //TODO make proper error component
    
    const { baseCurrency, tradeCurrency } = separateUrlPair(pair)
    const total = 100.0

    useEffect(() => {
        if(isReady){
            // @ts-ignore
            telegram.BackButton.show();
      }
      }, [telegram, isReady]);
    



    const { data, error, isLoading } = useQuery("orderBook", 
        () => getOrderbook(baseCurrencyTmp, tradeCurrencyTmp), {
        onSuccess: (data) => {
            // console.log("query")
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
   
    console.log(data.data.results);

    return (
        <Box>
        <Typography variant="h4">
            {baseCurrency}/{tradeCurrency}
        </Typography>
        <OrderForm 
            baseCurrency={baseCurrency} 
            priceCurrency={tradeCurrency} 
            totalAmout={total} 
            defaultPrice={0.0001238}
            issueOrder = {(e) => {}}
        />
        </Box>
    )
}