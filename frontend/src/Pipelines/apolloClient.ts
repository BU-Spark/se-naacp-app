import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const deployment_uri = process.env.REACT_APP_NAACP_DEPLOYMENT_URI;

const queryURI = `${deployment_uri}/queryValues`;
const httpLink = createHttpLink({
  uri: queryURI,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('clerk-db-jwt'); // Use the clerk-db-jwt token
  const orgToken = localStorage.getItem('token'); // Get the org token

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      'x-org-token': orgToken // Add org token to headers
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
