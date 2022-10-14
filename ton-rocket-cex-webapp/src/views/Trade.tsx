import {useLocation} from 'react-router-dom';
import Decimal from 'decimal.js';


import { Order, OrderForm } from '@/components/OrderInputs/OrderForm';
import CustomBackdrop from "@/components/CustomBackdrop";
import { getOrderbook, getPairInfo } from "@/api/currencies";
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
import { useDispatch } from 'react-redux';
import { setBaseCurrency, setQuoteCurrency } from '@/context/currencyPairSlice';


const totalTmp = new Decimal(123.4)

export default function Trade() {
    const { pair } = useParams();
    const dispatch = useDispatch()
    
    // const location = useLocation();
    // location.state.test

    const [isOrderValid, setIsOrderValid] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);
    
    const [[orderbookPrice, orderbookOrderAction], setOrderbookOrder] = 
        useState([new Decimal(0.0), OrderAction.Buy])

    WebApp.enableClosingConfirmation();
        
    if (pair == null) return (<div>Pair not specified</div>); //TODO make proper error component
        
    // TODO? pass pair via useLocation together with market price etc (already at hand in Currency.tsx)
    const { baseCurrency, quoteCurrency } = separateUrlPair(pair)
    useEffect(() => {
            dispatch(setBaseCurrency(baseCurrency))
        dispatch(setQuoteCurrency(quoteCurrency))
    }, [])

    // //TODO onClose show confirm popup (see DurgerKing)
    // WebApp.MainButton.setParams({
     
    //   });


    const handleMainButton = () => {
        // WebApp.showPopup({ title: "Order details", message: "TODO" })
        if(order && isOrderValid){
            WebApp.showPopup({title: "Order successful", message: JSON.stringify(order)})
        }else{
            WebApp.showPopup({ title: "Invalid order", message: "Please fill in the details of your order." })
        }
    }
    
    const [updateSignal, setUpdateSignal] = useState(false)
    const { data, error, isLoading } = useQuery("orderBook", 
        () => getOrderbook(baseCurrency, quoteCurrency), {
        onSuccess: (data) => {
            setUpdateSignal(!updateSignal)
            // setOrderbookOrder([data.data.results.marketPrice, orderbookOrderAction])
        },
        refetchInterval: 10000, 
    });

    const {data: pairInfo, error: pairInfoError, isLoading: pairInfoLoading} 
        = useQuery("pairInfo", () => getPairInfo(baseCurrency, quoteCurrency))

    if (isLoading || pairInfoLoading)
        return (<CustomBackdrop />);
    else if (error || pairInfoError) 
        return <div>Error loading orderbook</div>;
   

    const result = data.data.results
    const pairResult : { base: Currency, quote: Currency } = pairInfo.data.results
    const marketPrice = result.marketPrice //data.results["marketPrice"] // data["marketPrice"]   

    const handleChange = (newOrder: Order, isOrderValid: boolean) => {
        setIsOrderValid(isOrderValid);
        if (isOrderValid) {
            // console.log(price, amount, orderAction.toString(), orderAction.toString(), isOrderValid)
            setOrder(newOrder)
        }
    }

    return (
            <MenuLayout title={pairResult.base.name+"/"+pairResult.quote.name} location="/trade">
            <Grid container position={'relative'}
                direction={"column"} flexWrap={'nowrap'} height={'100%'}>
                {/* <Typography variant="h6" component="div" className='SectionTitle'>
                    Order
                </Typography> */}
                <Grid item flexBasis={'200px'} position="relative" className="SectionContainer" sx={{my: 2}}>
                    <OrderForm 
                        baseCurrency={pairResult.base} 
                        quoteCurrency={pairResult.quote}
                        totalUserAmount={totalTmp} 
                        marketPrice={marketPrice}
                        orderbookPrice={orderbookPrice}
                        orderbookOrderAction={orderbookOrderAction}
                        // handleIssueOrder = {handleIssueOrder}
                        onChange = {handleChange}
                    />
                </Grid>
                {/* <Typography variant="h6" component="div" className='SectionTitle'>
                    Orderbook
                </Typography> */}
                <Grid item flexBasis={'240px'} position="relative">
                    {/* <button onClick={() => setOrderIssued(true)}> PLACE ORDER </button> */}
                    <Orderbook
                        onRowClick={setOrderbookOrder}
                        updateSignal={updateSignal}
                        marketState={data.data.results}
                    />
                </Grid>
            </Grid>
            {/* TODO read color from theme */}
            <MainButton onClick={handleMainButton} text={t("PLACE_ORDER")} color={"rgb(49, 181, 69)"} progress={false} />
            </MenuLayout>
    )
}