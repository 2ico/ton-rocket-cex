import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell"; 
import {TableCellProps} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import OrderbookColumn from "@/components/OrderbookColumn";

import { useTranslation } from 'react-i18next';

/* BEGIN: TO BE REMOVED */
import Decimal from 'decimal.js';
const randomMarketPrice = (min: number, max: number) => Math.random() * (max - min) + min;
const randomPriceChange = (min: number, max: number) => Math.random() * (max - min) + min;

function getOrderbook(baseCurrency: string, priceCurrency: string) {
    const marketPrice = new Decimal(randomMarketPrice(0.420, 6.9))
    const randomAmount = (max: number) => new Decimal(Math.random() * max);

    function* monotonicRandomIterator(end : Decimal, startValue = new Decimal(0.0), maxStep = 0.0, sign=1) {
        for (let i = 0; end.greaterThan(i); i += 1) {
            startValue = randomAmount(maxStep).mul(sign).plus(startValue)
            yield startValue
        }
    }
    const buyerPrice = monotonicRandomIterator(new Decimal(10), marketPrice, 0.05, -1)
    const sellerPrice = monotonicRandomIterator(new Decimal(10), marketPrice, 0.05, 1)
    
    return {
        marketPrice : marketPrice,
        buyers : Array.from(buyerPrice, (p) => ({price : p, amount: randomAmount(10)})).reverse(),
        sellers : Array.from(sellerPrice, (p) => ({price : p, amount: randomAmount(10)})),
    }
}

interface Pair {
    price: Decimal,
    amount: Decimal
}

/* TO BE REMOVED END */


export default function Orderbook()
{
    const { t } = useTranslation();

    const generateTableHead = (alignment: TableCellProps["align"], labels: string[]) => {
        return (
            <TableRow>
                {labels.map((label, index) => (  
                    <TableCell key={index} align={alignment}>{t(label)}</TableCell>
                ))}
            </TableRow>
        );
    };    

    const {marketPrice, buyers, sellers} = getOrderbook("", "")

    return (
        <div>
        <div style={{width:"45%", marginRight:"10%", float:"left" }}>
            <OrderbookColumn 
                tableRow={generateTableHead("left", ["amount", "bid"])}
                alignment={"left"}
                orderbookEntries={buyers}
                entryToColumnMap={{ 0: "amount", 1: "price"}}
                />
        </div>
        <div style={{width:"45%", float: "right"}}>
            <OrderbookColumn
                tableRow={generateTableHead("right", ["ask", "amount"])}
                alignment={"right"}
                orderbookEntries={sellers}
                entryToColumnMap={{ 0: "price", 1: "amount"}}

            />
        </div>
        </div>
    )
}