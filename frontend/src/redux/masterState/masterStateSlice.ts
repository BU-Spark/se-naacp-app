import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import initThunkMethods from '../../Pipelines/initPipeline';

export const masterStateSlice = createSlice({
    name: 'masterState',
    initialState: {
      neighborhoods_master:[],
      topics_master: [],
      tracts_master: [],
      universal_loading_state: false
    },
    reducers: {
      setNeighborhoodMaster: (state, neighs: PayloadAction<any>) => {
        state.neighborhoods_master = neighs.payload;
      },
      setTopicsMaster: (state, topics: PayloadAction<any>) => {
        state.topics_master = topics.payload;
      },
      setTractsMaster: (state, tracts: PayloadAction<any>) => {
        state.tracts_master = tracts.payload;
      },
      setLoadingState: (state, bool: PayloadAction<boolean>) => {
        state.universal_loading_state = bool.payload;
      },
    },
    extraReducers: (builder) => {
      builder.addCase(initThunkMethods.bootstrapClientDataStruct.fulfilled, (state, action) => {
        state.neighborhoods_master = action.payload[0];
        state.topics_master = action.payload[1];
      });
    }
  })

export const { setNeighborhoodMaster, setTopicsMaster, setTractsMaster, setLoadingState } = masterStateSlice.actions

export default masterStateSlice.reducer