import React, { useEffect, useState } from "react";
import Decimal from 'decimal.js';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';
import { SliderProps } from "@mui/material/Slider";

import Input from '@mui/material/Input';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import IncrementButton from './IncrementButton'
import InputLabel from "@mui/material/InputLabel";
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { FormHelperText } from "@mui/material";


interface DecimalSliderProps {
    sliderProps: SliderProps,
    value: Decimal,
    max: Decimal,
    onChange: (amount : Decimal) => void
}

const DecimalSlider = ({sliderProps, value: decimal_value, max: decimal_max, onChange}: DecimalSliderProps) => 
        <Slider {...sliderProps} value={(decimal_value.dividedBy(decimal_max).toNumber())} min = {0} max={1.0} step={0.10}
            onChange={(event: Event, newValue : number | number[]) => { onChange(decimal_max.times(newValue as number) ) }} />

interface AmountSelectorProp {
    totalAmount: Decimal,
    amountType: string,
    amountState: [Decimal, boolean],
    onChange: ([newPrice, isValid]: [Decimal, boolean]) => void,
}

const AmountSelector = ({ totalAmount, amountType, amountState, onChange: setAmountState } : AmountSelectorProp) 
    : JSX.Element => 
{
    const { t } = useTranslation();
    const [amount, isValid] = amountState
    const [amountText, setAmountText] = useState("0")
    const [firstUse, setFirstUse] = useState(true)

    useEffect(() => {
        if (amountText == "" || !amount.equals(new Decimal(amountText)))
            setAmountText(amount.toFixed())
    }, [ amount ])

    const isAmountValid = (newAmount: Decimal) => {
        return newAmount.greaterThan(0) && (newAmount.lessThanOrEqualTo(totalAmount))
    }

    const getErrorMessage = () => {
        if (isValid || firstUse) return ""
        else if (amountText == "" || amount.lessThanOrEqualTo(0)) return t("invalid_amount")
        return t("amount_exceeds_budget")
    }

    const handleTextChange = (text: string) => {
        setFirstUse(false)
        setAmountText(text)
        if (text !== "") {
            const newAmount = new Decimal(Number(text))
            setAmountState([newAmount, isAmountValid(newAmount)])
        }
        else {
            setAmountState([amount, false])
        }
    }

    const handleButtonChange = (sign: number) => {
        setFirstUse(false)
        if (amountText !== ""){
            let newAmount = amount.plus(totalAmount.times(sign).times(0.01));
            setAmountState([newAmount, isAmountValid(newAmount)])
        }
    }

    const handleSliderChange = (amount: Decimal) => {
        setFirstUse(false)
        setAmountState([amount, isAmountValid(amount)])
    }

    return (
        <Box className="Form-control-container">
            <FormControl>
            <InputLabel>{t("amount")}</InputLabel>
            <Input               
                    startAdornment={
                        <InputAdornment position="start">
                            <IncrementButton
                                onClick={() => handleButtonChange(-1)}
                                isPlusButton = {false}
                            />
                        </InputAdornment>}
                    endAdornment={
                        <InputAdornment position="end">
                        {""}
                        <IncrementButton
                            onClick={() => handleButtonChange(1)}
                            isPlusButton = {true}       
                        />
                        </InputAdornment>}
                    value={amountText}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleTextChange(e.target.value)}}
                    error = {!(isValid || firstUse)}
                    type='number'
                />
                <DecimalSlider 
                    sliderProps={{valueLabelFormat: (x) => (x*100.0).toFixed(0) + "%", valueLabelDisplay: "auto"}}
                    value={amount}
                    max={totalAmount}
                    onChange={handleSliderChange}
                />
                <FormHelperText error>{getErrorMessage()}</FormHelperText>
            </FormControl>            
        </Box>
    )
}

export default AmountSelector;

/*

PlaceOrder
    SelectLR[Buy|Sell]
    SelectDrop[Market|Limit]
    PickPrice[number]
    PickAmount[mumber]
*/