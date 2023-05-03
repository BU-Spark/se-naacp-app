import { configureStore } from '@reduxjs/toolkit'
import masterReducer from './masterState/masterStateSlice'

export default configureStore({
    reducer: {
        masterState: masterReducer,
    },
})