import { configureStore } from '@reduxjs/toolkit'
import { errorSliceReducer } from './access/ErrorSlice';
import { adminSliceReducer } from './admin/AdminSlice';


const store = configureStore({
    reducer: {
        error_status: errorSliceReducer,
        admin:adminSliceReducer
    }
})

export default store;