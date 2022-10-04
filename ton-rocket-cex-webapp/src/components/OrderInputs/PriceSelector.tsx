import React, { useEffect, useState } from "react";

import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import IncrementButton from './IncrementButton'
import Box from '@mui/material/Box';

interface PriceSelectorProp {
    amount: number,
    setAmount: (newAmount: number) => void 
    amountType: string,
    isDisabled: boolean,
    defaultText: string,
    defaultPrice: number,
}

const PriceSelector = ({ amount, setAmount, amountType, isDisabled, defaultPrice } : PriceSelectorProp) 
    : JSX.Element => 
{
    // const [amount, setAmount] = useState(defaultPrice)
    const [amountText, setAmountText] = useState(defaultPrice.toString())

    useEffect(() => {
        if (isDisabled)
            setAmountText("")
        else 
            setAmountText(amount.toString())
    }, [isDisabled])

    useEffect(() => {
        if (amount >= 0)
            setAmountText(amount.toString())
    }, [ amount ])

    const handleTextChange = (text: string) => {
        setAmountText(text)
        if (text !== "") {
            const bounded = Math.max(0, Number(text))
            setAmount(bounded)

            // wont allow you to type an amount outside [0, totalAmout]
            if (bounded !== Number(text))
                setAmountText(bounded.toString())
        } else {
            setAmount(-(amount+1))
            // negative values signal an invalid
            // input field but one may
            // retrive the old valid value with Math.abs so
            // that the slider can still use it
        }
    }   

    const handleButtonChange = (sign: number) => {
        if (amount < 0) return;
        const bounded = Math.max(0, amount + sign) // sign*(what?)
        setAmount(bounded)
    }

    return (
        <Box
            sx={{
                maxWidth: 480,
                m: 3
            }}
        >   
            <FormControl sx={{ width: "100%" }} variant="outlined"  disabled={true}>
            <InputLabel> Price </InputLabel>    
            <Input
                disabled={isDisabled}
                startAdornment={
                    <InputAdornment position="start">
                        <IncrementButton
                            onClick={() => handleButtonChange(-1)}
                            isPlusButton = {false}
                            isDisabled={isDisabled}
                        />
                    </InputAdornment>
                }
                value={amountText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleTextChange(e.target.value)}}
                error = {amount < 0}
                type='number'
                endAdornment={
                    <InputAdornment position="end">
                        {""}
                        <IncrementButton
                            onClick={() => handleButtonChange(1)}
                            isPlusButton = {true}       
                            isDisabled={isDisabled}            
                        />
                    </InputAdornment>
                }
            />
            </FormControl>
        </Box>
    )
}

export default PriceSelector;

/*

PlaceOrder
    SelectLR[Buy|Sell]
    SelectDrop[Market|Limit]
    PickPrice[number]
    PickAmount[mumber]
*/