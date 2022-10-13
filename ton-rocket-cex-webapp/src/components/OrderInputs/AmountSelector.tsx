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
import { FormHelperText, Grid } from "@mui/material";

interface AmountSelectorProp {
    quoteMax: Decimal,
    amountType: string,
    amountState: [Decimal, boolean],
    onChange: ([newPrice, isValid]: [Decimal, boolean]) => void,
}

function baseToQuote(baseAmount: Decimal, price: Decimal){
    return baseAmount.div(price)
}

function quoteToBase(quoteAmount: Decimal, price: Decimal){
    return quoteAmount.times(price)
}

const AmountSelector = ({ quoteMax, amountType, amountState, onChange: setAmountState } : AmountSelectorProp) 
    : JSX.Element => 
{
    const { t } = useTranslation();
    const [amount, isValid] = amountState
    const [baseAmountText, setBaseAmountText] = useState("0")
    const [quoteAmountText, setQuoteAmountText] = useState("0")
    const [firstUse, setFirstUse] = useState(true)

    //prop
    const price = new Decimal(0.432)
    const precision = new Decimal(0.001)

    useEffect(() => {
        if (baseAmountText == "" || !amount.equals(new Decimal(baseAmountText))){
            setBaseAmountText(amount.toString())
            setQuoteAmountText(baseToQuote(amount, price).toString())
        }
    }, [ amount ])

    const isAmountValid = (newAmount: Decimal) => {
        return newAmount.greaterThan(0) && (newAmount.lessThanOrEqualTo(quoteMax))
    }

    const getErrorMessage = () => {
        if (isValid || firstUse) return ""
        else if (baseAmountText == "" || amount.lessThanOrEqualTo(0)) return t("invalid_amount")
        return t("amount_exceeds_budget")
    }

    const handleBaseTextChange = (text: string) => {
        setFirstUse(false)
        setBaseAmountText(text)
        if (text !== "") {
            const newAmount = new Decimal(Number(text))
            setAmountState([newAmount, isAmountValid(newAmount)])
        }
        // else {
        //     //setAmountState([amount, false])
        // }
    }

    const handleQuoteTextChange = (text: string) => {
        setFirstUse(false)
        setBaseAmountText(text)
        if (text !== "") {
            //TODO handle commission fee
            const newAmount = new Decimal(Number(text)).times(price);
            setAmountState([newAmount, isAmountValid(newAmount)])
        }
    }

    const handleButtonChange = (sign: number) => {
        setFirstUse(false)
        if (baseAmountText !== ""){
            let newAmount = amount.plus(quoteMax.times(sign).times(precision));
            setAmountState([newAmount, isAmountValid(newAmount)])
        }
    }

    const handleSliderChange = (quoteAmount: Decimal) => {
        setFirstUse(false)
        let baseAmount = quoteToBase(quoteAmount, price)
        setAmountState([baseAmount, isAmountValid(baseAmount)])
    }

    return (
        <Box className="Form-control-container">
            <FormControl>
            <InputLabel>{t("amount")}</InputLabel>
            <Grid container spacing={2} mt={0.75}>
                <Grid item flexBasis={"80px"} flexGrow={1}>
                    <Input               
                            // startAdornment={
                            //     <InputAdornment position="start">
                            //         <IncrementButton
                            //             onClick={() => handleButtonChange(-1)}
                            //             isPlusButton = {false}
                            //         />
                            //     </InputAdornment>}
                            endAdornment={
                                <InputAdornment position="end">
                                    TON
                                </InputAdornment>}
                            value={baseAmountText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleBaseTextChange(e.target.value)}}
                            error = {!(isValid || firstUse)}
                            type='number'
                        />
                </Grid>
                <Grid item flexBasis={"80px"} flexGrow={1}>
                    <Input               
                        // startAdornment={
                        //     <InputAdornment position="start">
                        //         <IncrementButton
                        //             onClick={() => handleButtonChange(-1)}
                        //             isPlusButton = {false}
                        //         />
                        //     </InputAdornment>}
                        endAdornment={
                            <InputAdornment position="end">
                                SCALE
                            </InputAdornment>}
                        value={quoteAmountText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleQuoteTextChange(e.target.value)}}
                        error = {!(isValid || firstUse)}
                        type='number'
                    />
                </Grid>
            </Grid>
            <Slider valueLabelFormat={(x) => (x*100.0).toFixed(0) + "%"} valueLabelDisplay="auto" value={(baseToQuote(amount, price).dividedBy(quoteMax).toNumber())} min={0} max={1.0} step={0.10}
            onChange={(event: Event, newValue : number | number[]) => handleSliderChange(quoteMax.times(newValue as number) ) } />
                {/* <DecimalSlider 
                    sliderProps={{valueLabelFormat: (x) => (x*100.0).toFixed(0) + "%", valueLabelDisplay: "auto"}}
                    value={amount}
                    max={totalAmount}
                    onChange={handleSliderChange}
                /> */}
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