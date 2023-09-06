import { createSlice } from '@reduxjs/toolkit'


export const masterStateSlice = createSlice({
    name: 'masterState',
    initialState: {
      neighborhoods_master:[],
      topics_master: [],
      tracts_master: [],
      universal_loading_state: false
    },
    reducers: {
      setNeighborhoodMaster: (state, neighs) => {
        state.neighborhoods_master = neighs;
      },
      setTopicsMaster: (state, topics) => {
        state.topics_master = topics;
      },
      setTractsMaster: (state, tracts) => {
        state.tracts_master = tracts;
      },
      setLoadingState: (state, bool) => {
        state.universal_loading_state = bool
      },
    },
  })

export const { setNeighborhoodMaster, setTopicsMaster, setTractsMaster, setLoadingState, setGraphLoadingState } = masterStateSlice.actions

export default masterStateSlice.reducer