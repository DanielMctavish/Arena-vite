import { createSlice } from "@reduxjs/toolkit"


const initialState = 200



const errorSlice = createSlice({
    name: "error",
    initialState,
    reducers: {
        updateError: (state, action) => {
            return state = action.payload
        }
    }
});



export const errorSliceReducer = errorSlice.reducer
export const { updateError } = errorSlice.actions