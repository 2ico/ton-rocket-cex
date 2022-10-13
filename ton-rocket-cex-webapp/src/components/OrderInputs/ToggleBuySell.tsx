import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { OrderAction } from '@/api/types';
import "./OrderInputs.css";

type Props = {
    currentValue: OrderAction,
    onChange: (selectedValue: OrderAction) => void,
};

function ToggleBuySell({ currentValue, onChange: handleChange }: Props) {
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
            className="buy-sell-toggle-button-group"
            value={currentValue}
            exclusive
            onChange={handleSelection}
            aria-label="text alignment"
        >
            <ToggleButton value="Buy" sx={{ color: "rgb(46, 125, 50)", borderColor: "rgb(46, 125, 50)",
            "&.Mui-selected" : {
                color: "rgb(46, 125, 50) !important",
                // backgroundColor: "rgba(46, 125, 50, 0.5) !important"
            },
            selected : {
                color: "#00F"
            }
            //  ":hover": { backgroundColor: "rgba(46, 125, 50, 0.2)" }
              }}>
                {t("buy")}
            </ToggleButton>
            <ToggleButton value="Sell" sx={{ color: "rgb(211, 47, 47)", borderColor: "rgb(211, 47, 47)", 
            "&.Mui-selected" : {
                color: "rgb(211, 47, 47) !important",
                // backgroundColor: "rgba(211, 47, 47, 0.5) !important" 
            },
            // ":hover": { backgroundColor: "rgba(211, 47, 47, 0.2)" } 
            }}>
                {t("sell")}
            </ToggleButton>
        </ToggleButtonGroup>
    );
}

export { OrderAction, ToggleBuySell };