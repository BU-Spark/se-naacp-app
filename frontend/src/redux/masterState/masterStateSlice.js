import { createSlice } from '@reduxjs/toolkit'


export const masterStateSlice = createSlice({
    name: 'masterState',
    initialState: {
      neighborhoods_master:[],
      topics_master: [],
      tracts_master: [],
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
    },
  })

export const { setNeighborhoodMaster, setTopicsMaster, setTractsMaster } = masterStateSlice.actions

export default masterStateSlice.reducer