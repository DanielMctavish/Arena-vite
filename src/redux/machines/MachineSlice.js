import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    machine_id: "empty",
    machine_state: false
};

const machineSlice = createSlice({
    name: "machine",
    initialState,
    reducers: {
        machineToDelete: (state, action) => {
            return state = action.payload
        },
        machineRunning: (state, action) => {
            return {
                ...state,
                machine_state: action.payload
            };
        }
    }
});

export const machineSliceReducer = machineSlice.reducer;
export const { machineToDelete, machineRunning } = machineSlice.actions;
