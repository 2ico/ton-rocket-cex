import React, { useEffect, useState } from "react";

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Slider from '@mui/material/Slider';

import Input from '@mui/material/Input';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';

import IncrementButton from './IncrementButton'
import InputLabel from "@mui/material/InputLabel";
import TextField from '@mui/material/TextField';
import { text } from "stream/consumers";


type RangeProp = {
    value: number,
    max: number,
    onChange: (amount : number) => void,
}

const Range = ({ value, max, onChange }: RangeProp) : JSX.Element => 
    <FormControl sx={{ width: "100%" }} variant="standard">
        <Slider value={value} min = {0} max={max} size="small" step={0.01}
            onChange={(event: Event, newValue : number | number[]) => { onChange(newValue as number) }} />
    </FormControl>

interface AmountSelectorProp {
    totalAmount: number,
    amountType: string,
    amountState: [number, boolean],
    setAmountState: ([newPrice, isValid]: [number, boolean]) => void,
    firstUse: boolean,
    setFirstUse: React.Dispatch<React.SetStateAction<boolean>>
}

const AmountSelector = ({ totalAmount, amountType, amountState, setAmountState, firstUse, setFirstUse } : AmountSelectorProp) 
    : JSX.Element => 
{
    const [amount, isValid] = amountState
    const [amountText, setAmountText] = useState("0")

    useEffect(() => {
        if (isValid || amountText !== "")
            setAmountText(amount.toString())
    }, [ amount ])

    const isAmountValid = (newAmount: number) => {
        return (0 < newAmount) && (newAmount <= totalAmount)
    }

    const getErrorMessage = () => {
        if (isValid || firstUse) return ""
        else if (amountText == "" || amount <= 0) return "Amount Invalid"
        return "Amount exceed your Budget"
    }

    const handleTextChange = (text: string) => {
        setFirstUse(false)
        setAmountText(text)
        if (text !== "") {
            const newAmount = Number(text)
            setAmountState([newAmount, isAmountValid(newAmount)])
        }
        else {
            setAmountState([amount, false])
        }
    }

    const handleButtonChange = (sign: number) => {
        setFirstUse(false)
        if (amountText !== "")
            setAmountState([amount + sign, isAmountValid(amount + sign)])
    }

    const handleSliderChange = (amount: number) => {
        setFirstUse(false)
        setAmountState([amount, isAmountValid(amount)])
    }

    return (
        <Box
            sx={{
                maxWidth: 480,
                m: 3
            }}
        >
            <FormControl sx={{ width: "100%" }} variant="outlined">
            <TextField
                InputProps={{
                    startAdornment:
                        <InputAdornment position="start">
                            <IncrementButton
                                onClick={() => handleButtonChange(-1)}
                                isPlusButton = {false}
                            />
                        </InputAdornment>,
                    endAdornment:
                        <InputAdornment position="end">
                        {""}
                        <IncrementButton
                            onClick={() => handleButtonChange(1)}
                            isPlusButton = {true}       
                        />
                        </InputAdornment>
                }}
                value={amountText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleTextChange(e.target.value)}}
                error = {!(isValid || firstUse)}
                type='number'
                label={"Amount"}
                variant="standard"  
                helperText={getErrorMessage()}
            />
            </FormControl>

            <br />
            
            <Range 
                value={amount}
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