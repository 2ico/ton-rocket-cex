import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { OrderAction } from '@/api/types';
import "./OrderInputs.css";

type Props = {
    currentValue: OrderAction,
    onChange : (selectedValue: OrderAction) => void,
};

function ToggleBuySell({currentValue, onChange: handleChange}: Props) {
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
            className="toggle-button buy-sell-toggle-button"
            value={currentValue}
            exclusive
            onChange={handleSelection}
            aria-label="text alignment"
        >
            <ToggleButton value="Buy">
                {t("buy")}
            </ToggleButton>
            <ToggleButton value="Sell">
                {t("sell")}
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
  
export {OrderAction, ToggleBuySell};