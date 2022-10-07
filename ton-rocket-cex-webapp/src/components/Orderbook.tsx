import { Component, useEffect, useState } from 'react';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell"; 
import {TableCellProps} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {OrderbookColumn} from "@/components/OrderbookColumn";
import { MarketState } from '@/api/currencies';
import { CSSProperties } from '@emotion/serialize';
import IncrementButton from '@/components/OrderInputs/IncrementButton'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import IconButton, { IconButtonClasses } from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useTranslation } from 'react-i18next';

import Decimal from 'decimal.js';
import { count } from 'console';
import { Grid } from '@mui/material';

const sliceEnd: number = 12;

function aggregate(
    marketPrice: Decimal, 
    aggregateStep: Decimal,
    orders: {
        price: Decimal;
        amount: Decimal;
    }[],
    computeBinIndex : (price: Decimal, marketPrice : Decimal, aggregateStep : Decimal) => number,
    sign : number
) {
    const bins : {[index : number] : [number, Decimal]} = { } 
    for (let i = 0; i < orders.length; i += 1) {
        const index = computeBinIndex(orders[i].price, marketPrice, aggregateStep)
        if (index in bins) {
            bins[index] = [index, bins[index][1].add(orders[i].amount)]
        } else {
            bins[index] = [index, orders[i].amount]
        }
    }

    const adjustedMarketPrice = new Decimal(0.0).add(
        new Decimal(computeBinIndex(marketPrice, new Decimal(0.0), aggregateStep)).mul(aggregateStep))
    const computeBinPrice = (index: number) => adjustedMarketPrice.add(aggregateStep.mul(index).mul(sign))

    const newOrders = []
    for (const bin of Object.values(bins)) {
        newOrders.push({
            price: computeBinPrice(bin[0]).toNumber(),
            amount: bin[1].toDecimalPlaces(2).toNumber()
        })
        if(newOrders.length > sliceEnd) break;
    }

    return newOrders
}

const computeBinIndexAsk = (price: Decimal, basePrice : Decimal, aggregateStep : Decimal) => 
    price.sub(basePrice).div(aggregateStep).ceil().toNumber()
const computeBinIndexBid = (price: Decimal, basePrice : Decimal, aggregateStep : Decimal) =>
    price.sub(basePrice).div(aggregateStep).floor().abs().toNumber()

const computeTotalAmount = (orders: {
        price: Decimal;
        amount: Decimal;
    }[]) => 
{
    return orders.reduce((partial, order) => partial.add(order.amount), new Decimal(0.0))
}

const precisionMultiples = [1, 5, 10, 50, 100, 200, 500]

type AggregationDisplayProps = {
    index: number,
    maxIndex: number,
    setIndex: (newIndex: number) => void,
    displayText: string,
};

const AggregationDisplay = ({index, maxIndex, setIndex, displayText} : AggregationDisplayProps) 
    : JSX.Element => 
{
    return (
        <div style={{float: "left"}}>
            <div style={{display: "inline-block"}}>
                <p > Aggregation: </p>
            </div>
            <div style={{display: "inline-block"}}>
                <IconButton color="primary" size="small"
                    onClick={() => setIndex(Math.max(0, index - 1))}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <div style={{display: "inline-block"}}>
                <p> {displayText} </p>
            </div>
            <div style={{display: "inline-block"}}>
                <IconButton color="primary" size="small"
                    onClick={() => setIndex(Math.min(maxIndex - 1, index + 1))}>
                    <ChevronRightIcon />
                </IconButton>            
            </div>
        </div>
    )
}

type Props = {
    updateSignal: boolean,  // useEffect on marketState won't work
    marketState: MarketState,
    onClick: (price: Decimal) => void
};

export default function Orderbook( {updateSignal, marketState, onClick: selectOrderbookPrice} : Props)
{
    const { t } = useTranslation();

    const {marketPrice, precision, buyers, sellers} = marketState
    const aggregationValues = precisionMultiples.map((m) => precision.mul(m))
    const [aggregationIndex, setAggregationIndex] = useState(0)

    const [totalAmountBuyers, totalAmountSellers] = [computeTotalAmount(buyers).toNumber(), computeTotalAmount(sellers).toNumber()]

    const [[aggregateBuyers, aggregateSellers], setAggregateOrders] = useState<
        [{ price: number, amount: number }[], { price: number, amount: number }[]]>([[], []])
    
    const [[rowStyleBuyers, rowStyleSellers], setRowStyle] = useState<
        [CSSProperties[], CSSProperties[]]>([[], []])

    useEffect(() => {
        const aggregation = aggregationValues[aggregationIndex]
        const [nextAggregateBuyers, nextAggregateSellers] = [
            aggregate(marketPrice, aggregation, buyers, computeBinIndexBid, -1).reverse(),
            aggregate(marketPrice, aggregation, sellers, computeBinIndexAsk, 1)
        ]
        setAggregateOrders([nextAggregateBuyers, nextAggregateSellers])
        setRowStyle([
            nextAggregateBuyers.slice(-sliceEnd).map(({price, amount}) => {
                const per = String(100.0 - (amount / totalAmountBuyers) * 100.0);
                return { background: `linear-gradient(90deg, #FFFFFF00 ${per}%, #08FF6B88 ${per}%)` }
            }),
            nextAggregateSellers.slice(0, sliceEnd).map(({price, amount}) => ({ background : `linear-gradient(90deg, #FF4C4C88 ${
                String(amount * 100 / totalAmountSellers)}%, #FFFFFF00 0%)`
            }))
        ])        
    }, [ aggregationIndex, updateSignal ])

    if (aggregateBuyers.length == 0) return (
        <div></div>
    )

    const tableHeadGenerator = (labels: [string, TableCellProps["align"]][]) => {
        return (
            <TableRow>
                {labels.map(([label, alignment], index) => (  
                    <TableCell key={index} align={alignment}>{t(label)}</TableCell>
                ))}
            </TableRow>
        );
    };

    interface tableRowGeneratorP {
        index: number,
        Component: React.ComponentType<any>,
        props: {[key:string]: any}
    }

    const tableRowGenerator = (index: number,
        RowComponent: React.ComponentType<any>,
        rowProps: {[key:string]: any},
        CellComponent: React.ComponentType<any>,
        cellProps: {[ket:string]: any}
    ) => {
        const buyerEntry = aggregateBuyers[aggregateBuyers.length - sliceEnd + index]
        const sellerEntry = aggregateSellers[index]

        const b = String(50 - (buyerEntry.amount * 50.0 / totalAmountBuyers))
        const s = String(50 + sellerEntry.amount * 50.0 / totalAmountSellers)
        const onBuyerClick = (() => selectOrderbookPrice(new Decimal(buyerEntry.price)))
        const onSellerClick = (() => selectOrderbookPrice(new Decimal(sellerEntry.price)))

        // add sell/buy suport!
        const orderShareBar = `linear-gradient(90deg, #FFFFFF ${b}%, #08FF6B ${b}%, #08FF6B 50%, #FF4C4C 50%, #FF4C4C ${s}%, #FFFFFF ${s}%)`
        return (
            <RowComponent style={{ background: orderShareBar }} {... rowProps}> 
                <CellComponent align={"left"} onClick={onBuyerClick} {... cellProps}> { 
                    buyerEntry.amount
                } </CellComponent>
                <CellComponent align={"left"} onClick={onBuyerClick} {... cellProps}> { 
                    buyerEntry.price
                } </CellComponent>
                <CellComponent align={"right"} onClick={onSellerClick} {... cellProps}> { 
                    sellerEntry.price
                } </CellComponent>
                <CellComponent align={"right"} onClick={onSellerClick} {... cellProps}> { 
                    sellerEntry.amount
                } </CellComponent>
            </RowComponent>
        )
    
    }

    // return (
    //     <div>
    //     <div style={{width:"100%", padding: "5%"}}>
    //     </div>
    //     <AggregationDisplay 
    //         index={aggregationIndex} 
    //         maxIndex={aggregationValues.length}
    //         setIndex={setAggregationIndex}
    //         displayText={aggregationValues[aggregationIndex].toString()}
    //     />
    //     <OrderbookColumn 
    //         tableRow={tableHeadGenerator([["amount", "left"], ["bid", "left"],
    //             ["ask", "right"], ["amount", "right"]])}
    //         rowGenerator={tableRowGenerator}
    //         count={sliceEnd}
    //     />
    //     </div>
    // )

    return (
        <Grid container>
        <Grid item>
        <AggregationDisplay 
            index={aggregationIndex} 
            maxIndex={aggregationValues.length}
            setIndex={setAggregationIndex}
            displayText={aggregationValues[aggregationIndex].toString()}
        />
        </Grid>
        <Grid item overflow={'scroll'}>
         <OrderbookColumn 
             tableRow={tableHeadGenerator([["amount", "left"], ["bid", "left"],
                 ["ask", "right"], ["amount", "right"]])}
            rowGenerator={tableRowGenerator}
             count={sliceEnd}
         />
        </Grid>
        </Grid>
    );
}

/*
const DecoratedRowBuyers = (index: number) => 
{
    const orderShareBar = `linear-gradient(90deg, #FF4C4C ${String(index)}%, #FFFFFF 0%)`
    const Inner = (children : JSX.Element) => {
        return <div style={{ background : orderShareBar }}  > {children} </div>
    }
    return Inner
}

... 
<div>
    {DecoratedRowBuyers(60)(<p> 1 </p>)}
    {DecoratedRowBuyers(10)(<p> 2 </p>)}
    {DecoratedRowBuyers(5)(<p> 3 </p>)}
</div>
*/