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
import { MainButton, BackButton } from '@twa-dev/sdk/react';

import { useEffect, useState } from 'react';
import Orderbook from '@/components/Orderbook';
import CustomToolbar from '@/components/CustomToolbar';
import {OrderAction} from '@/components/OrderInputs/ToggleBuySell';
import { t } from 'i18next';


const totalTmp = new Decimal(123.4)

export default function Trade() {
    const { pair } = useParams();
    const navigate = useNavigate();
    
    // const location = useLocation();
    // location.state.test

    const [isValidOrder, setIsValidOrder] = useState(false);
    
    const [orderIssued, setOrderIssued] = useState(false)
    const [firstUse, setFirstUse] = useState(true)
    const [[orderbookPrice, orderbookOrderAction], setOrderbookOrder] = 
        useState([new Decimal(0.0), OrderAction.Buy])

    if (pair == null) return (<div>Pair not specified</div>); //TODO make proper error component
    
    // TODO? pass pair via useLocation together with market price etc (already at hand in Currency.tsx)
    const { baseCurrency, tradeCurrency } = separateUrlPair(pair)

    //TODO onClose show confirm popup (see DurgerKing)
    WebApp.MainButton.setParams({
        color: "rgb(49, 181, 69)",
        text: "PLACE ORDER",
        is_visible: true,
        is_active: false,
      });

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

    const handleIssueOrder = ({ price, amount, orderType, orderAction }: Order, isOrderValid: boolean) => {
        if (isOrderValid) {
            console.log(price, amount, orderAction.toString(), orderAction.toString(), isOrderValid) 
        }
        else 
            setOrderIssued(false)
            setFirstUse(false)
    }

    return (
        <Box height={'100%'} position={"static"} overflow={'scroll'}>
        <Box>
            <CustomToolbar location="/trade">{baseCurrency}/{tradeCurrency}</CustomToolbar>
        </Box>
        <Box>
            {/* <Grid container divider={<Divider flexItem />}> */}
            <Grid container alignItems="center" position={'relative'} justifyContent="center"
  direction={"column"} flexWrap={'nowrap'} height={'100%'}>
                <Grid item flexBasis={'240px'} flexGrow={1} overflow={'scroll'} position="relative">
                    {/* <button onClick={() => setOrderIssued(true)}> PLACE ORDER </button> */}
                    <Orderbook
                        onRowClick={setOrderbookOrder}
                        updateSignal={updateSignal}
                        marketState={data.data.results}
                    />
                </Grid>
                <Grid item flexBasis={'200px'} flexGrow={0.1} position="relative">
                    <OrderForm 
                        baseCurrency={baseCurrency} 
                        priceCurrency={tradeCurrency}
                        precision={data.data.results.precision}
                        totalAmount={totalTmp} 
                        defaultPrice={tradePrice}
                        orderbookPrice={orderbookPrice}
                        orderbookOrderAction={orderbookOrderAction}
                        handleIssueOrder = {handleIssueOrder}
                        orderIssued = {orderIssued}
                        firstUse = {firstUse}
                        setFirstUse = {setFirstUse}
                    />
                </Grid>
            </Grid>
        </Box>
        <BackButton onClick={() => navigate("/")}/>
        <MainButton disabled={!isValidOrder} onClick={handleMainButton} text={t("PLACE_ORDER")}/>
        </Box>
    )
}