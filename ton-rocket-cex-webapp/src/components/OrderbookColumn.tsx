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
import { CSSProperties } from "@mui/styled-engine";

interface entryPair {
    price: Decimal,
    amount: Decimal
}

interface OrderbookComumnProp {
    tableRow: JSX.Element,
    alignment: TableCellProps["align"],
    orderbookEntries: {price: number; amount: number}[],
    entryToColumnMap: { [id: number] : keyof entryPair },
    rowStyle : CSSProperties[]
}

function OrderbookColumn({tableRow, alignment, orderbookEntries, entryToColumnMap, rowStyle} : OrderbookComumnProp) {
    const { t } = useTranslation();
      
    // const genGradient = (index: number) => {
    //     return (
    //         "linear-gradient(90deg, #FFC0CBFF " + String(20 * index + 10) + "%, #FFFFFF00 0%)"
    //     );
    // };      

    return (
        <TableContainer component={Box} >
        <Table sx={{ minWidth: 100 }} size="small">
            <TableHead>
                {tableRow}
            </TableHead>
            <TableBody>
                {orderbookEntries.map((entryPair, index) => (
                    <TableRow key={index} sx={rowStyle[index]}>
                        <TableCell align={alignment}>{entryPair[entryToColumnMap[0]]}</TableCell>
                        <TableCell align={alignment}>{entryPair[entryToColumnMap[1]]}</TableCell>
                    </TableRow>
                 ))}                
            </TableBody>
        </Table>
      </TableContainer>
    )
}

export { OrderbookColumn };