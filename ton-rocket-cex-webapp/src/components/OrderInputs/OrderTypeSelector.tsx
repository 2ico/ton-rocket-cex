import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { OrderType } from '@/api/types';

interface OrderTypeProp {
    currentOrderType : OrderType,
    handleChange : (selectedValue: OrderType) => void,
}

const OrderSelector = ({handleChange, currentOrderType} : OrderTypeProp) 
    : JSX.Element => 
{
    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={currentOrderType.toString()}
          onChange={(e: SelectChangeEvent) => handleChange(
            (e.target.value == "Market") ? OrderType.Market : OrderType.Limit)}
        >
        <MenuItem value={OrderType.Limit}>Limit</MenuItem>
        <MenuItem value={OrderType.Market}>Market</MenuItem>
        </Select>
      </FormControl>
    )
}

export {OrderType, OrderSelector}