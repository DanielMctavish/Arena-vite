import { configureStore } from '@reduxjs/toolkit'
import { errorSliceReducer } from './access/ErrorSlice';
import { adminSliceReducer } from './admin/AdminSlice';
import { machineSliceReducer } from "./machines/MachineSlice"
import { clientSliceReducer } from './client/ClientSlice';

const store = configureStore({
    reducer: {
        error_status: errorSliceReducer,
        admin: adminSliceReducer,
        machine: machineSliceReducer,
        client:clientSliceReducer
    }
})

export default store;