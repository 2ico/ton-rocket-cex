import { useEffect, useState } from 'react';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell"; 
import {TableCellProps} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {OrderbookColumn} from "@/components/OrderbookColumn";

import { useTranslation } from 'react-i18next';

/* BEGIN: TO BE REMOVED */
import Decimal from 'decimal.js';
import { CSSProperties } from '@mui/styled-engine-sc';
const randomMarketPrice = (min: number, max: number) => Math.random() * (max - min) + min;
const randomPriceChange = (min: number, max: number) => Math.random() * (max - min) + min;

interface Pair {
    price: Decimal,
    amount: Decimal
}

type MarketState = {
    marketPrice: Decimal;
    precision: Decimal;
    buyers: {
        price: Decimal;
        amount: Decimal;
    }[];
    sellers: {
        price: Decimal;
        amount: Decimal;
    }[];
};

function marketGenerator(buyerNumber : number, sellerNumber : number) {
    const precision = new Decimal(0.01)
    const defaultMaxOffset = 8000
    const defaultMaxAmount = new Decimal(100)
    const defaultMaxMarketPrice = new Decimal(100)

    const randomAmount = (max: Decimal) => new Decimal(max.mul(Math.random()));
    const randomInteger = (max: number) => Math.floor(Math.random() * Math.random() * max + 1)

    function randomOrder(
        baseValue: Decimal, 
        sign: number, 
        precision: Decimal,
        maxOffset: number
    ) {
        return  {
            price: baseValue.add(precision.mul(randomInteger(maxOffset)).mul(sign)),
            amount : randomAmount(defaultMaxAmount)
        }
    }

    function* ordersGenerator(
        amount: number, 
        baseValue: Decimal, 
        sign: number,
        precision: Decimal,
        maxOffset: number
    ) {
            for (let i = 0; i < amount; i += 1) {
                yield randomOrder(baseValue, sign, precision, maxOffset)
        }
    }

    let marketGlobalState : { [pair: string] : MarketState } = { }

    const updateMarketState = (pair : string) => {
        if (pair in marketGlobalState) { 
            // update existing market pair
            // TEMPORARY STOP UPDATING
            
            const marketPrice = marketGlobalState[pair].marketPrice
            const precision = marketGlobalState[pair].precision

            for (let i = 0; i < Math.sqrt(buyerNumber); i += 1) {
                const index = Math.floor(Math.random() * buyerNumber);
                marketGlobalState[pair].buyers[index] = 
                    randomOrder(marketPrice, -1, precision, defaultMaxOffset)                
            }

            for (let i = 0; i < Math.sqrt(sellerNumber); i += 1) {
                const index = Math.floor(Math.random() * sellerNumber);
                marketGlobalState[pair].sellers[index] = 
                    randomOrder(marketPrice, 1, precision, defaultMaxOffset)                
            }

        } else {
            // generate market pair
            const marketPrice = randomAmount(defaultMaxMarketPrice).add(precision.mul(defaultMaxOffset))
            console.log(marketPrice.toNumber())
            marketGlobalState[pair] = {
                marketPrice: marketPrice,
                precision: precision,
                buyers : Array.from(ordersGenerator(buyerNumber, marketPrice, -1, precision, defaultMaxOffset)),
                sellers : Array.from(ordersGenerator(sellerNumber, marketPrice, 1, precision, defaultMaxOffset))
            }
        }

        // sort entries
        const currentMarket = marketGlobalState[pair]
        currentMarket.buyers.sort((
            {price: lPrice, amount: lAmount}, {price: rPrice, amount: rAmount}) =>
                (lPrice.minus(rPrice)).toNumber())

        currentMarket.sellers.sort((
            {price: lPrice, amount: lAmount}, {price: rPrice, amount: rAmount}) =>
                (lPrice.minus(rPrice)).toNumber())

        return currentMarket
    }

    return updateMarketState
}

const myMarket = marketGenerator(20, 20)

/* TO BE REMOVED END */

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

    const computeBinPrice = (index: number) => marketPrice.add(aggregateStep.mul(index).mul(sign))

    const newOrders = []
    for (const bin of Object.values(bins)) {
        newOrders.push({
            price: computeBinPrice(bin[0]),
            amount: bin[1]
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

export default function Orderbook()
{
    const { t } = useTranslation();

    const {marketPrice, precision, buyers, sellers} = myMarket("a-b")
    const [totalAmountBuyers, totalAmountSellers] = [computeTotalAmount(buyers), computeTotalAmount(sellers)]

    const [flag, setFlag] = useState(false)
    const [[aggregateBuyers, aggregateSellers], setAggregateOrders] = useState([ buyers, sellers ])
    const [[rowStyleBuyers, rowStyleSellers], setRowStyle] = useState<
        [CSSProperties[], CSSProperties[]]>([[], []])
    
    useEffect(() => {
        setAggregateOrders([
            aggregate(marketPrice, precision.mul(flag ? 200 : 1), buyers, computeBinIndexBid, -1).reverse(),
            aggregate(marketPrice, precision.mul(flag ? 200 : 1), sellers, computeBinIndexAsk, 1)
        ])
    }, [ flag ])

    useEffect(() => {
        setRowStyle([
            aggregateBuyers.map(({price, amount}) => {
                const per = String(new Decimal(100.0).sub(amount.div(totalAmountBuyers).mul(100)));
                return { background: `linear-gradient(90deg, #FFFFFF ${per}%, #08FF6B ${per}%)` }
            }),
            aggregateSellers.map(({price, amount}) => ({ background : `linear-gradient(90deg, #FF4C4C ${
                String(amount.div(totalAmountSellers).mul(100))}%, #FFFFFF 0%)`
            }))
        ])
    }, [aggregateBuyers])

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
                orderbookEntries={flag ? aggregateBuyers : buyers }
                entryToColumnMap={{ 0: "amount", 1: "price"}}
                rowStyle={rowStyleBuyers}
                />
        </div>
        <div style={{width:"45%", float: "right"}}>
            <OrderbookColumn
                tableRow={generateTableHead("right", ["ask", "amount"])}
                alignment={"right"}
                orderbookEntries={flag ? aggregateSellers : sellers}
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