import React, { isValidElement, useEffect, useMemo, useState } from "react";
import Decimal from 'decimal.js';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import Input, { InputProps } from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import IncrementButton from './IncrementButton'
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useThemeProps } from "@mui/system";
import { useTranslation } from 'react-i18next';
import { Form } from "react-router-dom";
import { FormHelperText } from "@mui/material";
import "@/components/OrderInputs/OrderInputs.css";

interface PriceSelectorProp {
    priceState: [Decimal, boolean],
    onChange: ([newPrice, isValid]: [Decimal, boolean]) => void,
    amountType: string,
    isDisabled: boolean,
    precision: Decimal
}

const PriceSelector = ({ priceState, onChange: setPriceState, isDisabled, amountType, precision } : PriceSelectorProp)
    : JSX.Element => 
{
    const { t } = useTranslation();
    const [price, isValid] = priceState;
    const [priceText, setPriceText] = useState(price.toString())

    /*
    useEffect(() => {
        if (isValid)
        setPriceText(price.toString())
    }, [ price, isValid ])
    */

    useEffect(() => {
        if (priceText == "" || !price.equals(new Decimal(priceText)))
            setPriceText(price.toFixed())
    }, [ price ])

    const handleTextChange = (text: string) => {
        setPriceText(text)
        if (text !== "")
            setPriceState([new Decimal(Number(text)), true])
        else
            setPriceState([price, false])
    }   

    const getErrorMessage = () => {
        if (priceText === "" || price.lessThan(0)) return t("invalid_amount")
        return ""
    }
    
    const handleButtonChange = (sign: number) => {
        if(isValid)
            setPriceState([price.plus(precision.times(sign)), true])
    }

    return (
        <Box className="Form-control-container">   
            <FormControl>
            <InputLabel>{t("price")}</InputLabel>
            <Input
                // autoFocus={true}
                endAdornment={
                        <InputAdornment position="end">
                        <IncrementButton
                        onClick={() => handleButtonChange(-1)}
                        isPlusButton = {false}
                        isDisabled={isDisabled}
                        />
                        {""}
                        <IncrementButton
                            onClick={() => handleButtonChange(1)}
                            isPlusButton = {true}       
                            isDisabled={isDisabled}            
                        />
                        </InputAdornment>
                }
                value={priceText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleTextChange(e.target.value)}}
                error = {!isValid || price.lessThan(0)}
                type='number'
                disabled={isDisabled}
            />
            
            <FormHelperText error>{getErrorMessage()}</FormHelperText>
            </FormControl>
        </Box>
    )
}

export default PriceSelector;