import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from 'apollo-upload-client';


const deployment_uri = process.env.REACT_APP_NAACP_DEPLOYMENT_URI;
//const temp_uri = 'https://corsproxy.io/?http://35.229.106.189:80/upload_csv';

const queryURI = `${deployment_uri}/graphql`;
//const queryURI = temp_uri;
const uploadLink = createUploadLink({
  uri: queryURI,
  credentials: 'include',
});


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('clerk-db-jwt'); // Use the clerk-db-jwt token
  const orgToken = localStorage.getItem('token'); // Get the org token

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'x-org-token': orgToken, // Add org token to headers
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});

export default client;
