import { ApolloClient, InMemoryCache } from '@apollo/client';


// const deployment_uri = process.env.NAACP_DEPLOYMENT_URI;
// const deployment_uri = "https://naacpbackend-production.up.railway.app"
const deployment_uri = "http://localhost:4000";

const queryURI = `${deployment_uri}/queryValues`;
const client = new ApolloClient({
  uri: queryURI,
  cache: new InMemoryCache(),
});

export default client;
