import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

const deployment_uri = "https://naacpbackend-production.up.railway.app"
// const deployment_uri = process.env.NAACP_DEPLOYMENT_URI;
// const local_uri = 'http://localhost:4000';

// Apollo Client Objects
const masterURI = `${deployment_uri}/universalValues`;

const clientMaster = new ApolloClient({
  uri: masterURI,
  cache: new InMemoryCache(),
});

const rootPathInitData = async () => {
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
  try {
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
  } catch (error) {
    message_neigh_list_dev_page = error;
    // message_topics_list_dev_page = error;
  }

  return [message_neigh_list, message_topics_list,message_neigh_list_dev_page,message_topics_list_dev_page];
};

const listenerMethods = {
  rootPathInitData: rootPathInitData,
};

export default listenerMethods;
