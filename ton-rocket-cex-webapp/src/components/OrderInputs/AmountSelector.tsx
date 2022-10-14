import React, { useEffect, useState } from "react";
import Decimal from 'decimal.js';

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';

import Slider from '@mui/material/Slider';
import { SliderProps } from "@mui/material/Slider";

import Input from '@mui/material/Input';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import InputLabel from "@mui/material/InputLabel";
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { FormHelperText, Grid } from "@mui/material";
import { Currency } from "@/api/types";

function baseToQuote(baseAmount: Decimal, price: Decimal){
    return baseAmount.times(price)
}

function quoteToBase(quoteAmount: Decimal, price: Decimal){
    return price.greaterThan(0) ? quoteAmount.div(price) : new Decimal(0.0)
}

interface AmountSelectorProp {
    totalUserQuote: Decimal,
    baseCurrency: Currency,
    quoteCurrency: Currency,
    price: Decimal,
    amountState: [Decimal, boolean],
    onChange: ([newPrice, isValid]: [Decimal, boolean]) => void,
}

const AmountSelector = ({ 
    totalUserQuote, 
    baseCurrency, 
    quoteCurrency,
    price, 
    amountState, 
    onChange: setAmountState 
} : AmountSelectorProp) 
    : JSX.Element => 
{
    const { t } = useTranslation();
    const [amount, isValid] = amountState
    const [baseAmountText, setBaseAmountText] = useState("0")
    const [quoteAmountText, setQuoteAmountText] = useState("0")
    const [firstUse, setFirstUse] = useState(true)

    const roundDown = (quantity: Decimal, precision: number) => 
        quantity.div(precision).floor().mul(precision)
    const roundUp = (quantity: Decimal, precision: number) => 
        quantity.div(precision).ceil().mul(precision)

    useEffect(() => {
        // triggers update from slider
        if (baseAmountText != "" && quoteAmountText != ""){
            const newQuote = roundUp(baseToQuote(amount, price), quoteCurrency.precision)
            setQuoteAmountText(newQuote.toString())
            setAmountState([amount, isQuoteValid(newQuote)])
        }
    }, [ price ])

    const isQuoteValid = (newAmount: Decimal) => {
        return newAmount.greaterThan(0) && (newAmount.lessThanOrEqualTo(totalUserQuote))
    }

    const getErrorMessage = () => {
        if (isValid || firstUse) return ""
        else if (baseAmountText == "" || quoteAmountText == "" || amount.lessThanOrEqualTo(0)) return t("invalid_amount")
        return t("amount_exceeds_budget")
    }

    const handleBaseTextChange = (text: string) => {
        setFirstUse(false)
        setBaseAmountText(text)
        if (text !== "") {
            console.log(text, "handled")
            const newAmount = roundUp(new Decimal(Number(text)), baseCurrency.precision)
            const newQuote = roundUp(baseToQuote(newAmount, price), quoteCurrency.precision)
            setQuoteAmountText(newQuote.toString())
            setAmountState([newAmount, isQuoteValid(newQuote)])

            // TODO: proper handle of finer than precision user input
            if (!newAmount.equals(Number(text))) 
                setBaseAmountText(newAmount.toString()) 
        }
        else {
            setAmountState([amount, false])
        }
    }

    const handleQuoteTextChange = (text: string) => {
        setFirstUse(false)
        setQuoteAmountText(text)
        if (text !== "") {
            //TODO handle commission fee
            const newQuote = roundDown(new Decimal(Number(text)), quoteCurrency.precision)
            const newAmount = roundDown(quoteToBase(newQuote, price), baseCurrency.precision)
            setBaseAmountText(newAmount.toString())
            setAmountState([newAmount, isQuoteValid(newQuote.toNearest(quoteCurrency.precision))])

            if (!newQuote.equals(Number(text))) 
                setQuoteAmountText(newQuote.toString()) 
        }
        else {
            setAmountState([amount, false])
        }
    }

    const handleSliderChange = (newQuote: Decimal) => {
        setFirstUse(false)
        const newAmount = roundDown(quoteToBase(newQuote, price), baseCurrency.precision)
        setBaseAmountText(newAmount.toString())
        setQuoteAmountText(newQuote.toString())
        setAmountState([newAmount, isQuoteValid(newQuote)])
    }

    return (
        <Box className="Form-control-container">
            <FormGroup>
                <Grid container spacing={2} mt={0.75}>
                    <Grid item flexBasis={"80px"} flexGrow={1}>
                        <InputLabel>{t("amount")}</InputLabel>
                        <Input               
                            endAdornment={
                                <InputAdornment position="end">
                                    {baseCurrency.name}
                                </InputAdornment>}
                            value={baseAmountText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleBaseTextChange(e.target.value)}}
                            error = {baseAmountText == ""}
                            type='number'
                        />
                    </Grid>
                    <Grid item flexBasis={"80px"} flexGrow={1}>
                        <InputLabel>{t("quote_amount")}</InputLabel>
                        <Input               
                            endAdornment={
                                <InputAdornment position="end">
                                    {quoteCurrency.name}
                                </InputAdornment>}
                            value={quoteAmountText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleQuoteTextChange(e.target.value)}}
                            error = {quoteAmountText == ""}
                            type='number'
                        />
                    </Grid>
                </Grid>
                <Slider 
                    valueLabelFormat={(x) => (x*100.0).toFixed(0) + "%"} 
                    valueLabelDisplay="auto" 
                    value={(baseToQuote(amount, price).dividedBy(totalUserQuote).toNumber())} 
                    min={0} max={1.0} step={0.10}
                    onChange={(event: Event, newValue : number | number[]) => 
                        handleSliderChange(totalUserQuote.times(newValue as number).toNearest(quoteCurrency.precision) ) } 
                />
                <FormHelperText error={!isValid}>{getErrorMessage()}</FormHelperText>
            </FormGroup>
        </Box>
    )
}

export default AmountSelector;