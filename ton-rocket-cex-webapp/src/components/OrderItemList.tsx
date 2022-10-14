import { Box } from "@mui/system"
import { OrderItem } from "@/components/OrderItem"
import { Order } from "@/api/types"
import List from '@mui/material/List';

import { useState } from "react";
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from "@mui/material/InputLabel";
import { Theme, useTheme } from "@mui/material/styles";
import { OrderAction } from "@/api/types";
import { OrderType } from "@/api/types";
import { styled } from '@mui/material/styles';
import { Callback, StringMap } from "i18next";
import Chip from '@mui/material/Chip';
import { useTranslation } from "react-i18next";

import {filterLabels, filterFunctions } from "@/utils/utils";
import { Divider } from "@mui/material";


interface BaseCurrencySelectProp {
    baseCurrencies: string[],
    selectedCurrecies: string[],
    onChange: (selectedCurrency: string[]) => void
}

const BaseCurrencySelect = ({baseCurrencies, selectedCurrecies, onChange} : BaseCurrencySelectProp) 
    : JSX.Element => 
{
    const theme = useTheme();

    const handleChange = (event: SelectChangeEvent<string[]>) => {
        const {target: { value }} = event;
        onChange((typeof value === "string") ? value.split(",") : value);
    };

    const getStyles = (currency: string, theme: Theme) => {
        return {
            fontWeight:
              selectedCurrecies.indexOf(currency) === -1
                ? theme.typography.fontWeightLight
                : theme.typography.fontWeightBold
          };        
    }  

    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Currencies</InputLabel>
            <Select
                multiple
                value={selectedCurrecies}
                onChange={handleChange}
            >
                {baseCurrencies.map((currency) => (
                    <MenuItem
                        key={currency}
                        value={currency}
                        style={getStyles(currency, theme)}
                    >
                        {currency}
                    </MenuItem>
                ))}            
          </Select>
      </FormControl>
    )
}

interface ChipData {
    key: number;
    label: string;
    filter: (order: Order) => boolean
}

interface ChipsFilterProp {
    chipData: ChipData[],
    setChipData: (callback: (update: ChipData[]) => ChipData[]) => void
}

const ChipsFilter = ({ chipData, setChipData } : ChipsFilterProp) 
    : JSX.Element => 
{
    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }));

    const handleDelete = (chipToDelete: ChipData) => () => {
        setChipData((chipData) => chipData.filter((chip) => chip.key !== chipToDelete.key));
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                listStyle: 'none',
                p: 0.5,
                m: 0,
            }}
            component="ul"
        >
            {chipData.map((data) => {
                return (
                    <Chip
                    label={data.label}
                    onDelete={handleDelete(data)}
                    />
                );
            })}
        </Box>
    );
}

interface UserOrderLstPromp {
    userOrders: Order[],
    onClick: (id: number) => void,
    filters: [string, string][]
}

const OrderItemList = ({userOrders, onClick, filters} : UserOrderLstPromp) 
    : JSX.Element => 
{
    const baseCurrencyList = Array.from(new Set(userOrders.map((order) => order.pair.base_currency)).values())

    const {t} = useTranslation();
    /*
    const tmpChipData : ChipData[] = []
    for (let i = 0; i < filters.length; i += 1) {
        const [filterName, filterValue] = filters[i]
        switch (filterName) {
            case 'BASE':
                tmpChipData.push({
                    key: i,
                    label: filterLables['BASE'](filterValue),
                    filter: filterFunctions['BASE'](filterValue)
                })
                break;
            case 'QUOTE':
                tmpChipData.push({
                    key: i,
                    label: filterLables['QUOTE'](filterValue),
                    filter: filterFunctions['QUOTE'](filterValue)
                })
                break;
            case 'CURRENCY':
                tmpChipData.push({
                    key: i,
                    label: filterLables['CURRENCY'](filterValue),
                    filter: filterFunctions['CURRENCY'](filterValue)
                })
            case 'TYPE':
                tmpChipData.push({
                    key: i,
                    label: filterLables['TYPE'](filterValue),
                    filter: filterFunctions['TYPE'](filterValue === "Limit" ? OrderType.Limit : OrderType.Market)
                })
                break;
            case 'ACTION':
                tmpChipData.push({
                    key: i,
                    label: filterLables['ACTION'](filterValue),
                    filter: filterFunctions['ACTION'](filterValue === "Buy" ? OrderAction.Buy : OrderAction.Sell)
                })            
            default:
              console.log("Wrong parameter passed to /order?");
        }
    }
    
    */

    const [chipFilters, setChipData] = useState(
        filters.filter(([key, value] : [string, string]) => Object.keys(filterLabels).includes(key))
            .map(([key, value] : [string, string], idx) => ({
                key: idx,
                // @ts-ignore
                label: filterLabels[key](value),
                // @ts-ignore
                filter: filterFunctions[key](value)
            })));

    if (baseCurrencyList.length == 0)
        return (<div>{t("order_history_empty")}</div>)

    const [selectedCurrency, setSelectedCurrency] = useState<string[]>([])

    return (
        <Box sx={{width: "100%"}}>
            <ChipsFilter 
                chipData={chipFilters}
                setChipData={setChipData}
            />
            <List>
                {userOrders.filter((order) => chipFilters.every(({key, label, filter}) => filter(order)))
                    .map((order) => (
                        <div>
                        <OrderItem
                            key={order.id}
                            order={order}
                            onCancel={onClick}
                        />
                        <Divider className="ListItemDivider"/>
                        </div>
                    ))}
            </List>
        </Box>
    )
}

export { OrderItemList }