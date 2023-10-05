import { ApolloClient, InMemoryCache } from '@apollo/client';

const local_uri = "http://localhost:4000";
const queryURI = `${local_uri}/queryValues`;
const client = new ApolloClient({
  uri: queryURI,
  cache: new InMemoryCache(),
});

export default client;
