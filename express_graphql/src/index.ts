import {ApolloServer}  from '@apollo/server';
import {startStandaloneServer}  from '@apollo/server/standalone';

import {typeDefs}  from "./graphql/schemas/type_definitions.js";
import {resolvers} from "./graphql/resolvers/graphql_resolvers.js";


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);


