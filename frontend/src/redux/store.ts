import { configureStore } from '@reduxjs/toolkit'
import masterReducer from './masterState/masterStateSlice'
import logger from 'redux-logger' // Doesn't come default for Middleware

const store = configureStore({
    reducer: {
        masterState: masterReducer,
    },
    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(logger),
});

export type AppDispatch = typeof store.dispatch; // Inferred type: {masterState: masterStateState}
export type RootState = ReturnType<typeof store.getState>; // Infer the `RootState` and `AppDispatch` types from the store itself

export default store