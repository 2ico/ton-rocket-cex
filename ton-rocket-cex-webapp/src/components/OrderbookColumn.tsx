import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {TableCellProps} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";


import { useTranslation } from 'react-i18next';

import Decimal from 'decimal.js';

interface entryPair {
    price: Decimal,
    amount: Decimal
}

interface OrderbookComumnProp {
    tableRow: JSX.Element,
    alignment: TableCellProps["align"],
    orderbookEntries: {price: Decimal; amount: Decimal}[],
    entryToColumnMap: { [id: number] : keyof entryPair }
}

export default function OrderbookColumn({tableRow, alignment, orderbookEntries, entryToColumnMap} : OrderbookComumnProp) {
    const { t } = useTranslation();
      
    const genGradient = (index: number) => {
        return (
            "linear-gradient(90deg, #FFC0CB " + String(20 * index + 10) + "%, #FFFFFF 0%)"
        );
    };      

    return (
        <TableContainer component={Box} >
        <Table sx={{ minWidth: 100 }} size="small">
            <TableHead>
                {tableRow}
            </TableHead>
            <TableBody>
                {orderbookEntries.map((entryPair, index) => (
                    <TableRow key={index}>
                        <TableCell align={alignment}>{entryPair[entryToColumnMap[0]].toFixed()}</TableCell>
                        <TableCell align={alignment}>{entryPair[entryToColumnMap[1]].toFixed()}</TableCell>
                    </TableRow>
                 ))}                
            </TableBody>
        </Table>
      </TableContainer>
    )
}