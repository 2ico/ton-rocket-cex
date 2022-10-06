import { useEffect, useState } from 'react';

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

import { useTranslation } from 'react-i18next';

import Decimal from 'decimal.js';

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
            amount: bin[1].toDecimalPlaces(3).toNumber()
        })
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

type Props = {
    updateSignal: boolean,  // useEffect on marketState won't work
    marketState: MarketState
};

export default function Orderbook( {updateSignal, marketState} : Props)
{
    const { t } = useTranslation();
    const sliceEnd: number = 12;

    const {marketPrice, precision, buyers, sellers} = marketState
    const [totalAmountBuyers, totalAmountSellers] = [computeTotalAmount(buyers).toNumber(), computeTotalAmount(sellers).toNumber()]

    const [flag, setFlag] = useState(false)
    const [[aggregateBuyers, aggregateSellers], setAggregateOrders] = useState<
        [{ price: number, amount: number }[], { price: number, amount: number }[]]>([[], []])
    const [[rowStyleBuyers, rowStyleSellers], setRowStyle] = useState<
        [CSSProperties[], CSSProperties[]]>([[], []])

    /*
    const [aggregateBuyers, aggregateSellers] = [ 
            aggregate(marketPrice, precision.mul(flag ? 200 : 1), buyers, computeBinIndexBid, -1).reverse(),
            aggregate(marketPrice, precision.mul(flag ? 200 : 1), sellers, computeBinIndexAsk, 1)]
    const [rowStyleBuyers, rowStyleSellers] = [
        aggregateBuyers.map(({price, amount}) => {
            const per = String(new Decimal(100.0).sub(amount.div(totalAmountBuyers).mul(100)));
            return { background: `linear-gradient(90deg, #FFFFFF ${per}%, #08FF6B ${per}%)` }
        }),
        aggregateSellers.map(({price, amount}) => ({ background : `linear-gradient(90deg, #FF4C4C ${
            String(amount.div(totalAmountSellers).mul(100))}%, #FFFFFF 0%)`
        }))]
    */

    useEffect(() => {
        const [nextAggregateBuyers, nextAggregateSellers] = [
            aggregate(marketPrice, precision.mul(flag ? 200 : 1), buyers, computeBinIndexBid, -1).reverse(),
            aggregate(marketPrice, precision.mul(flag ? 200 : 1), sellers, computeBinIndexAsk, 1)
        ]
        setAggregateOrders([nextAggregateBuyers, nextAggregateSellers])
        setRowStyle([
            nextAggregateBuyers.slice(-sliceEnd).map(({price, amount}) => {
                const per = String(100.0 - (amount / totalAmountBuyers) * 100.0);
                return { background: `linear-gradient(90deg, #FFFFFF ${per}%, #08FF6B ${per}%)` }
            }),
            nextAggregateSellers.slice(0, sliceEnd).map(({price, amount}) => ({ background : `linear-gradient(90deg, #FF4C4C ${
                String(amount * 100 / totalAmountSellers)}%, #FFFFFF 0%)`
            }))
        ])        
    }, [ flag, updateSignal ])

    const generateTableHead = (alignment: TableCellProps["align"], labels: string[]) => {
        return (
            <TableRow>
                {labels.map((label, index) => (  
                    <TableCell key={index} align={alignment}>{t(label)}</TableCell>
                ))}
            </TableRow>
        );
    };    

    return (
        <div>
        <div style={{width:"45%", marginRight:"10%", float:"left" }}>
            <OrderbookColumn 
                tableRow={generateTableHead("left", ["amount", "bid"])}
                alignment={"left"}
                orderbookEntries={aggregateBuyers.slice(-sliceEnd)}
                entryToColumnMap={{ 0: "amount", 1: "price"}}
                rowStyle={rowStyleBuyers}
                />
        </div>
        <div style={{width:"45%", float: "right"}}>
            <OrderbookColumn
                tableRow={generateTableHead("right", ["ask", "amount"])}
                alignment={"right"}
                orderbookEntries={aggregateSellers.slice(0, sliceEnd)}
                entryToColumnMap={{ 0: "price", 1: "amount"}}
                rowStyle={rowStyleSellers}
            />
        </div>
        <button onClick={() => setFlag(!flag)}>
            Activate
        </button>
        </div>
    )
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