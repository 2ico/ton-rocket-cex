import { createSlice } from '@reduxjs/toolkit'

export const filterSlice = createSlice({
    name: 'filterParams',
    initialState: {
        value: {
            baseCurrency: null, 
            quoteCurrency: null, 
            currency: null, 
            type: null, 
            action: null
        } // with same interface as generateParamProps?
    },
    reducers: {
        selectBaseCurrency: (state, action) => {
            state.value.baseCurrency = action.payload
        },
        selectQuoteCurrency: (state, action) => {
            state.value.quoteCurrency = action.payload
        },        
    },
})

// Action creators are generated for each case reducer function
export const { selectBaseCurrency, selectQuoteCurrency } = filterSlice.actions

export default filterSlice.reducer