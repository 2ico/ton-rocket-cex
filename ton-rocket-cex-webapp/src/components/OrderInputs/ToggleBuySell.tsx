import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


enum OrderAction {
    Buy = "Buy",
    Sell = "Sell"
}

type Props = {
    currentValue: OrderAction,
    handleChange : (selectedValue: OrderAction) => void,
};

function ToggleBuySell({currentValue, handleChange}: Props) {
    const { t } = useTranslation();
    const handleSelection = (
        event: React.MouseEvent<HTMLElement>,
        newValue: string | null,
      ) => {
        if (newValue !== null)
            handleChange(newValue === "Buy" ? OrderAction.Buy : OrderAction.Sell);
      };
  
    return (
        <ToggleButtonGroup
            value={currentValue}
            exclusive
            onChange={handleSelection}
            aria-label="text alignment"
        >
            <ToggleButton value="Buy">
                {t("Buy")}
            </ToggleButton>
            <ToggleButton value="Sell">
                {t("Sell")}
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
  
export {OrderAction, ToggleBuySell};