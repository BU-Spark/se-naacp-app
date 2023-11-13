import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { createAsyncThunk } from '@reduxjs/toolkit';

const deployment_uri = process.env.NAACP_DEPLOYMENT_URI;
// const local_uri = 'http://localhost:4000';

// Apollo Client Objects
const masterURI = `${deployment_uri}/universalValues`;

const clientMaster = new ApolloClient({
  uri: masterURI,
  cache: new InMemoryCache(),
});

// Data Validation
// This needs to be fast as possible! This can possible generate performance overhead.
const validateInitData = (data: any): boolean => { 
    return true;
};

// ** I am a little nervous that this method might cause "silent API errors"
const fetchInitData = async(): Promise<any> => {
    const GET_NEIGHBORHOOD_LIST = gql`
      {
        getNeighborhoodList
      }
    `;

    const GET_TOPICS_LIST = gql`
      {
        getTopicList
      }
    `;

    let message_neigh_list;
    let message_topics_list;
    let message_neigh_list_dev_page;
    let message_topics_list_dev_page;

    message_neigh_list = await clientMaster
        .query({
        query: GET_NEIGHBORHOOD_LIST,
        })
        .then((_res) => {
        return _res;
        });

    message_topics_list = await clientMaster
        .query({
        query: GET_TOPICS_LIST,
        })
        .then((_res) => {
        return _res;
        });

    message_neigh_list_dev_page = JSON.stringify (JSON.parse(message_neigh_list.data.getNeighborhoodList));
    message_topics_list_dev_page = JSON.stringify(message_topics_list.data.getTopicList);
    message_neigh_list = JSON.parse(message_neigh_list.data.getNeighborhoodList);
    message_topics_list = message_topics_list.data.getTopicList;

    return [message_neigh_list, message_topics_list, message_neigh_list_dev_page, message_topics_list_dev_page];
};

const bootstrapClientDataStruct = createAsyncThunk('', async (_, thunkAPI) => {
    try {
        const dataArray = await fetchInitData();
        if (validateInitData(dataArray)) {
            // We might do some processing here.
            return thunkAPI.fulfillWithValue(dataArray); // Not a good way, but still works
        } else {
            return thunkAPI.rejectWithValue("[initMethods] Data validation failed with function 'bootstrapClientDataStruct'");
        }
    } catch (err: any) {
        return thunkAPI.rejectWithValue(`[initMethods] Fatal Error in fetching with ${err.message}`);
    }
});

const initThunkMethods = {
    bootstrapClientDataStruct: bootstrapClientDataStruct
};
  
export default initThunkMethods;