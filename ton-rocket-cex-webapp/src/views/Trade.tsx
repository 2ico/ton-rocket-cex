import {OrderForm} from '@/components/OrderForm';
import {getOrderbook} from "@/api/currencies";
import {Currency} from "@/api/types"
import { useQuery } from 'react-query';

import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const baseCurrency : Currency = {
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

const priceCurrency : Currency = {
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
    const { data, error, isLoading } = useQuery("orderBook", 
        () => getOrderbook(baseCurrency, priceCurrency), {
        onSuccess: (data) => {
            // console.log("query")
            // let baseCurrencies = data.data.results;
            // setBaseCurrency(baseCurrencies[0]);
        },
        refetchInterval: 5000, 
    
    });

    const total : number = 100.0
    const baseCurr : string = "TON"
    const priceCurr : string = "BTC"

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
        <OrderForm 
            baseCurrency={baseCurr} 
            priceCurrency={priceCurr} 
            totalAmout={total} 
            defaultPrice={0.0001238}
            issueOrder = {(e) => {}}
        />
    )
}