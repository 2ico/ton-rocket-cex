import { useState, useEffect } from 'react';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import {TableCellProps} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import TablePagination from '@mui/material/TablePagination';


import { useTranslation } from 'react-i18next';

import Decimal from 'decimal.js';
import { CSSProperties } from "@mui/styled-engine";

interface entryPair {
    price: Decimal,
    amount: Decimal
}

interface RowGenerator {
    index: number,
    RowComponent: React.ComponentType<any>,
    CellComponent: React.ComponentType<any>,
    rowProps: {[key:string]: any},
    cellProps: {[ket:string]: any}
}

interface OrderbookComumnProp {
    tableRow: JSX.Element,
    rowGenerator: (index: number,
        RowComponent: React.ComponentType<any>,
        rowProps: {[key:string]: any},
        CellComponent: React.ComponentType<any>,
        cellProps: {[ket:string]: any}
        ) => JSX.Element,
    count: number,
}

function OrderbookColumn({tableRow, rowGenerator, count} : OrderbookComumnProp) 
{
    const { t } = useTranslation();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };

    return (
        <TableContainer component={Box} >
        <Table stickyHeader sx={{ minWidth: 100, height: "100%" }} size="small" aria-label="sticky table">
            <TableHead>
                {tableRow}
            </TableHead>
            <TableBody>
                {[... Array(count).keys()].map((index) => 
                    rowGenerator(index, TableRow, { key: index }, TableCell, {}))}
            </TableBody>
        </Table>
        </TableContainer>
    )
}

export { OrderbookColumn };