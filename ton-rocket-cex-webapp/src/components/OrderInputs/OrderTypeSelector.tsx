import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { OrderType } from '@/api/types';

interface OrderTypeProp {
    currentOrderType : OrderType,
    onChange : (selectedValue: OrderType) => void,
}

const OrderSelector = ({onChange: handleChange, currentOrderType} : OrderTypeProp) 
    : JSX.Element => 
{
    return (
        <FormControl variant="standard" sx={{minWidth: "8em"}}>
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