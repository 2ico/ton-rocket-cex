import React, { isValidElement, useEffect, useState } from "react";

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import IncrementButton from './IncrementButton'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useThemeProps } from "@mui/system";


interface PriceSelectorProp {
    priceState: [number, boolean],
    setPriceState: ([newPrice, isValid]: [number, boolean]) => void,
    amountType: string,
    isDisabled: boolean
}

const PriceSelector = ({ priceState, setPriceState, amountType, isDisabled } : PriceSelectorProp)
    : JSX.Element => 
{
    const [price, isValid] = priceState;
    const [priceText, setPriceText] = useState(price.toString())

    useEffect(() => {
        if (isValid)
        setPriceText(price.toString())
    }, [ price, isValid ])

    const handleTextChange = (text: string) => {
        setPriceText(text)
        if (text !== "")
            setPriceState([Number(text), true])
        else
            setPriceState([price, false])
    }   

    const getErrorMessage = () => {
        if (priceText === "" || price < 0) return "Amount Invalid"
        return ""
    }

    const handleButtonChange = (sign: number) => {
        if(isValid)
            setPriceState([price + sign, true])
    }

    return (
        <Box
            sx={{
                maxWidth: 480,
                m: 3
            }}
        >   
            <FormControl sx={{ width: "100%" }}  >
            <TextField
                InputProps={{
                    startAdornment:
                        <InputAdornment position="start">
                            <IncrementButton
                                onClick={() => handleButtonChange(-1)}
                                isPlusButton = {false}
                                isDisabled={isDisabled}
                            />
                        </InputAdornment>,
                    endAdornment:
                        <InputAdornment position="end">
                        {""}
                        <IncrementButton
                            onClick={() => handleButtonChange(1)}
                            isPlusButton = {true}       
                            isDisabled={isDisabled}            
                        />
                        </InputAdornment>
                
                }}
                value={priceText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleTextChange(e.target.value)}}
                error = {!isValid || price < 0}
                type='number'
                variant="standard"
                label="price"
                helperText={getErrorMessage()}
                disabled={isDisabled}
            />
            </FormControl>
        </Box>
    )
}

export default PriceSelector;