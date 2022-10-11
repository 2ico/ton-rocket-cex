import {useLocation} from 'react-router-dom';
import Decimal from 'decimal.js';


import { Order, OrderForm } from '@/components/OrderForm';
import CustomBackdrop from "@/components/CustomBackdrop";
import { getOrderbook } from "@/api/currencies";
import { Currency } from "@/api/types"
import { useQuery } from 'react-query';

import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useNavigate, useParams } from 'react-router-dom';
import { separateUrlPair } from "@/utils/utils"
import { AppBar, Box, Divider, Grid, Stack, Toolbar, Typography } from '@mui/material';

import WebApp from '@twa-dev/sdk'
import { MainButton } from '@twa-dev/sdk/react';

import { useEffect, useState } from 'react';
import Orderbook from '@/components/Orderbook';
import CustomToolbar from '@/components/CustomToolbar';
import {OrderAction} from '@/components/OrderInputs/ToggleBuySell';
import { t } from 'i18next';
import MenuLayout from '@/components/MenuLayout';


const totalTmp = new Decimal(123.4)

export default function Trade() {
    const { pair } = useParams();
    const navigate = useNavigate();
    
    // const location = useLocation();
    // location.state.test

    const [isOrderValid, setIsOrderValid] = useState(false);
    
    const [[orderbookPrice, orderbookOrderAction], setOrderbookOrder] = 
        useState([new Decimal(0.0), OrderAction.Buy])

    if (pair == null) return (<div>Pair not specified</div>); //TODO make proper error component
    
    // TODO? pass pair via useLocation together with market price etc (already at hand in Currency.tsx)
    const { baseCurrency, tradeCurrency } = separateUrlPair(pair)

    // //TODO onClose show confirm popup (see DurgerKing)
    // WebApp.MainButton.setParams({
     
    //   });

    const handleMainButton = () => {
        WebApp.showPopup({ title: "Order details", message: "TODO" })
    }
    
    const [updateSignal, setUpdateSignal] = useState(false)
    const { data, error, isLoading } = useQuery("orderBook", 
        () => getOrderbook(baseCurrency, tradeCurrency), {
        onSuccess: (data) => {
            setUpdateSignal(!updateSignal)
            // setOrderbookOrder([data.data.results.marketPrice, orderbookOrderAction])
        },
        refetchInterval: 10000, 
    });

    if (isLoading) 
        return (<CustomBackdrop />);
    else if (error) 
        return <div>Error loading orderbook</div>;
   

    const result = data.data.results
    const tradePrice = result.marketPrice //data.results["marketPrice"] // data["marketPrice"]   

    const handleChange = ({ price, amount, orderType, orderAction }: Order, isOrderValid: boolean) => {
        setIsOrderValid(isOrderValid);
        if (isOrderValid) {
            console.log(price, amount, orderAction.toString(), orderAction.toString(), isOrderValid) 
        }
    }

    return (
            <MenuLayout title={baseCurrency+"/"+tradeCurrency} location="/trade">
            <Grid container position={'relative'}
                direction={"column"} flexWrap={'nowrap'} height={'100%'} >
                <Typography gutterBottom variant="h4" component="div">
                    Order
                </Typography>
                <Grid item flexBasis={'200px'} flexGrow={0} position="relative">
                    <OrderForm 
                        baseCurrency={baseCurrency} 
                        priceCurrency={tradeCurrency}
                        precision={data.data.results.precision}
                        totalAmount={totalTmp} 
                        defaultPrice={tradePrice}
                        orderbookPrice={orderbookPrice}
                        orderbookOrderAction={orderbookOrderAction}
                        // handleIssueOrder = {handleIssueOrder}
                        onChange = {handleChange}
                    />
                </Grid>
                <Typography gutterBottom variant="h4" component="div">
                    Orderbook
                </Typography>
                <Grid item flexBasis={'240px'} flexGrow={1} position="relative">
                    {/* <button onClick={() => setOrderIssued(true)}> PLACE ORDER </button> */}
                    <Orderbook
                        onRowClick={setOrderbookOrder}
                        updateSignal={updateSignal}
                        marketState={data.data.results}
                    />
                </Grid>
            </Grid>
            <MainButton onClick={handleMainButton} text={t("PLACE_ORDER")} color={"rgb(49, 181, 69)"} progress={false} />
            </MenuLayout>
    )
}