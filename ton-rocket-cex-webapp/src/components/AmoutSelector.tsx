import React, { useEffect, useState } from "react";

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';

import Input from '@mui/material/Input';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import IncrementButton from './IncrementButton'
import InputLabel from "@mui/material/InputLabel";

type RangeProp = {
    value: number,
    max: number,
    onChange: (amount : number) => void,
}

const Range = ({ value, max, onChange }: RangeProp) : JSX.Element => 
    <FormControl sx={{ width: "100%" }} variant="standard">
        <Slider value={value} min = {0} max={max} size="small"
            onChange={(event: Event, newValue : number | number[]) => { onChange(newValue as number) }} />
    </FormControl>

interface AmountSelectorProp {
    amount: number,
    totalAmount: number,
    amountType: string,
    setAmount : (newAmount: number) => void 
}

const AmountSelector = ({ amount, setAmount, totalAmount, amountType } : AmountSelectorProp) 
    : JSX.Element => 
{
    // const [amount, _setAmount] = useState(0)
    const [amountText, setAmountText] = useState("0")

    useEffect(() => {
        // prevents +/- when input field is invalid
        if (amount >= 0)
            setAmountText(amount.toString())
    }, [ amount ])

    const handleTextChange = (text: string) => {
        setAmountText(text)
        if (text !== "") {
            const bounded = Math.min(totalAmount, 
                Math.max(0, Number(text)))
                setAmount(bounded)

            // wont allow you to type an amount outside [0, totalAmout]
            if (bounded != Number(text))
                setAmountText(bounded.toString())
        } else {
            setAmount(-amount)
            // negative values signal an invalid
            // input field but one may
            // retrive the old valid value with Math.abs so
            // that the slider can still use it
        }
    }   

    const handleButtonChange = (sign: number) => {
        if (amount < 0) return;
        const bounded = Math.min(totalAmount, 
            Math.max(0, amount + sign)) // sign*(what?)
            setAmount(bounded)
    }

    const handleSliderChange = (amount: number) => {
        setAmount(amount)
    }

    return (
        <Box
            sx={{
                maxWidth: 480,
                m: 3
            }}
        >
            <FormControl sx={{ width: "100%" }} variant="outlined">
            <InputLabel> Amount </InputLabel>    

            <Input
                // defaultValue={"Amount"}
                
                startAdornment={
                    <InputAdornment position="start">
                        <IncrementButton
                            onClick={() => handleButtonChange(-1)}
                            isPlusButton = {false}                   
                        />
                    </InputAdornment>
                }
                value={amountText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleTextChange(e.target.value)}}
                error = {amount < 0}
                type='number'
                endAdornment={
                    <InputAdornment position="end">
                        {amountType}
                        <IncrementButton
                            onClick={() => handleButtonChange(1)}
                            isPlusButton = {true}                   
                        />
                    </InputAdornment>
                }
            />
            </FormControl>

            <br />
            
            <Range 
                value={Math.abs(amount)}
                max={totalAmount}
                onChange={handleSliderChange}
            />
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