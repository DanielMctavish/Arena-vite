import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    admin_id: "empty"
}


const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        updateAdmin: (state, action) => {
            return state = action.payload
        }
    }
});


export const adminSliceReducer = adminSlice.reducer
export const { updateAdmin } = adminSlice.actions