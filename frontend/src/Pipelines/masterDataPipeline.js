import { gql, ApolloClient, InMemoryCache } from '@apollo/client';

// Apollo Client Object
const masterURI = 'http://localhost:4000/universalValues' // Will be automated

const clientMaster = new ApolloClient({
  uri: masterURI,
  cache: new InMemoryCache(),
});

const rootPathInitData = async() => {
  const GET_NEIGHBORHOOD_LIST = gql`
  { getNeighborhoodList }
  `;

  const GET_TOPICS_LIST = gql`
  { getTopicList }
  `;

  let message_neigh_list = await clientMaster.query({
    query: GET_NEIGHBORHOOD_LIST,
  }).then((_res) => {
    return _res
  });

  let message_topics_list = await clientMaster.query({
    query: GET_TOPICS_LIST,
  }).then((_res) => {
    return _res
  });

  message_neigh_list = JSON.parse(message_neigh_list.data.getNeighborhoodList);
  message_topics_list = message_topics_list.data.getTopicList;

  return [message_neigh_list, message_topics_list]
};

const listenerMethods = {
  rootPathInitData: rootPathInitData
}

export default listenerMethods