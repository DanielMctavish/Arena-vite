import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    client_id: "empty",
}


const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {
        selectedClient: (state, action) => {
            return state = action.payload
        }
    }
});


export const clientSliceReducer = clientSlice.reducer
export const { selectedClient } = clientSlice.actions