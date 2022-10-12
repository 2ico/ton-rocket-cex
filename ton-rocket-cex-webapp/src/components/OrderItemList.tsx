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

interface UserOrderLstPromp {
    userOrders: Order[],
    onClick: (id: number) => void
}

const OrderItemList = ({userOrders, onClick} : UserOrderLstPromp) 
    : JSX.Element => 
{
    const baseCurrencyList = Array.from(new Set(userOrders.map((order) => order.baseCurrency.name)).values())

    if (baseCurrencyList.length == 0)
        return (<div> No orders placed </div>)

    const [selectedCurrency, setSelectedCurrency] = useState<string[]>([])

    return (
        <Box>
            <BaseCurrencySelect 
                baseCurrencies={baseCurrencyList}
                selectedCurrecies={selectedCurrency}
                onChange={setSelectedCurrency}
            />
            <List sx={{ width: '100%' }}>
                {userOrders.filter((order) => (selectedCurrency.includes(order.baseCurrency.name) || selectedCurrency.length == 0))
                    .map((order) => (
                        <OrderItem
                        key={order.id}
                        order={order}
                        onClick={onClick}
                        />
                    ))}
            </List>
        </Box>
    )
}

export { OrderItemList }