import { createSlice } from '@reduxjs/toolkit';
import initThunkMethods from './initPipeline';

type DataState = {
    loading: boolean;
    loaded: boolean;
    error: string | undefined
}

const initialState: DataState = {
    loading: false,
    loaded: false,
    error: undefined
}

const dataSlice = createSlice({
    name: 'dataSlice',
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(initThunkMethods.bootstrapClientDataStruct.pending, (state) => {
            state.loading = true;
            state.loaded = false;
            state.error = undefined;
        })
        .addCase(initThunkMethods.bootstrapClientDataStruct.fulfilled, (state) => {
            state.loading = false;
            state.loaded = true;
            state.error = undefined;
        })
        .addCase(initThunkMethods.bootstrapClientDataStruct.rejected, (state, action) => {
            state.loading = false;
            (typeof action.payload == 'string') ? state.error = action.payload : state.error = undefined;
        });
    },
});

export default dataSlice.reducer;