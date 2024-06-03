import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    machine_id: "empty"
}


const machineSlice = createSlice({
    name: "machine_id",
    initialState,
    reducers: {
        machineToDelete: (state, action) => {
            return state = action.payload
        }
    }
});


export const machineSliceReducer = machineSlice.reducer
export const { machineToDelete } = machineSlice.actions