import Select, { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { OrderType } from '@/api/types';
import { InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface OrderTypeProp {
    currentOrderType : OrderType,
    onChange : (selectedValue: OrderType) => void,
}

const OrderSelector = ({onChange: handleChange, currentOrderType} : OrderTypeProp) 
    : JSX.Element => 
{
    const { t } = useTranslation();
    return (
        <FormControl variant="standard" sx={{minWidth: "5em"}}>
        <InputLabel>{t("order_type")}</InputLabel>
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