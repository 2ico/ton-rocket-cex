import { Component, useEffect, useState } from 'react';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell"; 
import {TableCellProps} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
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
import {OrderAction} from '@/components/OrderInputs/ToggleBuySell';


import { useTranslation } from 'react-i18next';

import Decimal from 'decimal.js';
import { Grid, InputLabel } from '@mui/material';

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
        new Decimal(computeBinIndex(marketPrice, new Decimal(0.0), aggregateStep) - sign).mul(aggregateStep))
    // const computeBinPrice = (index: number) => adjustedMarketPrice.add(aggregateStep.mul(index).mul(sign))
    const computeBinPrice = (index: number) => (adjustedMarketPrice).add(aggregateStep.mul(index).mul(sign))

    const newOrders = []
    for (const bin of Object.values(bins)) {
        newOrders.push({
            price: computeBinPrice(bin[0]),
            amount: bin[1]
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
        <Box sx={{textAlign: "center"}}>
            <InputLabel size="small" sx={{transform: "none", fontSize: "0.75em"}}>
                Aggregation
            </InputLabel>
            <Box>
                <IconButton color="primary" size="small"
                    onClick={() => setIndex(Math.max(0, index - 1))}
                    disabled={index == 0}
                    >
                    <ChevronLeftIcon />
                </IconButton>
                <div style={{minWidth: '2em', display: "inline-block", textAlign: 'center'}}> {displayText}</div>
                <IconButton color="primary" size="small"
                    onClick={() => setIndex(Math.min(maxIndex - 1, index + 1))}
                    disabled={index == maxIndex - 1}>
                    <ChevronRightIcon />
                </IconButton> 
            </Box>         
        </Box>
    )
}

type OrderbookProps = {
    updateSignal: boolean,  // useEffect on marketState won't work
    marketState: MarketState,
    onRowClick: ([price, orderAction] : [Decimal, OrderAction]) => void
};

export default function Orderbook( {updateSignal, marketState, onRowClick: selectOrderbookPrice} : OrderbookProps)
{
    const { t } = useTranslation();

    const {marketPrice, precision, buyers, sellers} = marketState
    const aggregationValues = precisionMultiples.map((m) => precision.mul(m))
    const [aggregationIndex, setAggregationIndex] = useState(0)

    const [totalAmountBuyers, totalAmountSellers] = [computeTotalAmount(buyers), computeTotalAmount(sellers)]

    const [[aggregateBuyers, aggregateSellers], setAggregateOrders] = useState<
        [{ price: Decimal, amount: Decimal }[], { price: Decimal, amount: Decimal }[]]>([[], []])
    
    const [[rowStyleBuyers, rowStyleSellers], setRowStyle] = useState<
        [CSSProperties[], CSSProperties[]]>([[], []])

        const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };


    useEffect(() => {
        const aggregation = aggregationValues[aggregationIndex]
        const [nextAggregateBuyers, nextAggregateSellers] = [
            aggregate(marketPrice, aggregation, buyers, computeBinIndexBid, -1).reverse(),
            aggregate(marketPrice, aggregation, sellers, computeBinIndexAsk, 1)
        ]
        setAggregateOrders([nextAggregateBuyers, nextAggregateSellers])
        setRowStyle([
            nextAggregateBuyers.slice(-sliceEnd).map(({price, amount}) => {
                const per = String(new Decimal(100.0).sub(amount.mul(100).div(totalAmountBuyers)));
                return { background: `linear-gradient(90deg, #FFFFFF00 ${per}%, #08FF6B88 ${per}%)` }
            }),
            nextAggregateSellers.slice(0, sliceEnd).map(({price, amount}) => ({ background : `linear-gradient(90deg, #FF4C4C88 ${
                String(amount.mul(100).div(totalAmountSellers))}%, #FFFFFF00 0%)`
            }))
        ])        
    }, [ aggregationIndex, updateSignal ])

    const tableHeadGenerator = (labels: [string, TableCellProps["align"]][]) => {
        return (
            <TableRow>
                {labels.map(([label, alignment], index) => (  
                    <TableCell key={index} align={alignment}>{t(label)}</TableCell>
                ))}
            </TableRow>
        );
    };

    const tableRowGenerator = (index: number,
        RowComponent: React.ComponentType<any>,
        rowProps: {[key:string]: any},
        CellComponent: React.ComponentType<any>,
        cellProps: {[key:string]: any}
    ) => {
        const buyerEntry = aggregateBuyers[aggregateBuyers.length - index - 1]
        const sellerEntry = aggregateSellers[index]

        const b = String(new Decimal(50).sub(buyerEntry.amount.mul(50.0).div(totalAmountBuyers)))
        const s = String(new Decimal(50).add(sellerEntry.amount.mul(50.0).div(totalAmountSellers)))
        const aggregation = aggregationValues[aggregationIndex]

        //TODO CSS animation
        // focus price cell
        const onBuyerClick = (() => selectOrderbookPrice([new Decimal(buyerEntry.price), OrderAction.Buy]))
        const onSellerClick = (() => selectOrderbookPrice([new Decimal(sellerEntry.price), OrderAction.Sell]))

        // TODO add sell/buy support!
        const orderShareBar = `linear-gradient(90deg, #FFFFFF00 ${b}%, #08FF6B ${b}%, #08FF6B 50%, #FF4C4C 50%, #FF4C4C ${s}%, #FFFFFF00 ${s}%)`
        const orderShareBarOnBuyerClick = `linear-gradient(90deg, #CCCCCC00 ${b}%, #08FF6B ${b}%, #08FF6B 50%, #FF4C4C 50%, #FF4C4C ${s}%, #FFFFFF00 ${s}%)`
        const orderShareBarOnSellerClick = `linear-gradient(90deg, #CCCCCC00 ${b}%, #08FF6B ${b}%, #08FF6B 50%, #FF4C4C 50%, #FF4C4C ${s}%, #FFFFFF00 ${s}%)`

        return (
            <RowComponent style={{ background: orderShareBar }} {... rowProps}>
                <CellComponent align={"left"} onClick={onBuyerClick} {... cellProps}> { 
                    buyerEntry.amount.toDecimalPlaces(2).toString()
                } </CellComponent>
                <CellComponent align={"left"} onClick={onBuyerClick} {... cellProps}> { 
                    buyerEntry.price.toFixed(Math.max(-aggregation.log(new Decimal(10)).floor().toNumber(), 0))
                } </CellComponent>
                <CellComponent align={"right"} onClick={onSellerClick} {... cellProps}> { 
                    sellerEntry.price.toFixed(Math.max(-aggregation.log(new Decimal(10)).floor().toNumber(), 0))
                } </CellComponent>
                <CellComponent align={"right"} onClick={onSellerClick} {... cellProps}> { 
                    sellerEntry.amount.toDecimalPlaces(2).toString()
                } </CellComponent>
            </RowComponent>
        )
    
    }

    let count = Math.min(sliceEnd, aggregateBuyers.length, aggregateSellers.length);

    return (
        <Grid container justifyContent="center" paddingX={2} position={"relative"}>
        <Grid item width={'100%'}>
        <TableContainer sx={{ maxHeight: '240px' }}>
        <Table stickyHeader size="small" sx={{tableLayout: "fixed"}} aria-label="sticky table">
            <TableHead>
                {tableHeadGenerator([["amount", "left"],["bid", "left"], ["ask","right"],["amount","right"]])}
            </TableHead>
            <TableBody>
                {[... Array(count).keys()].map((index) => 
                    tableRowGenerator(index, TableRow, { key: index }, TableCell, {}))}
            </TableBody>
        </Table>
        </TableContainer>    
        </Grid>
        <Grid item sx={{marginY: 1}}>
        <AggregationDisplay
            index={aggregationIndex} 
            maxIndex={aggregationValues.length}
            setIndex={setAggregationIndex}
            displayText={aggregationValues[aggregationIndex].toString()}
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