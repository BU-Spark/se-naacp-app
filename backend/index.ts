import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./graphql/schemas/type_definitions.js";
import { resolvers } from "./graphql/resolvers/graphql_resolvers.js";

import { MongoClient, Db } from "mongodb";
import { GraphQLError } from "graphql";

interface Context {
  db: Db;
}

type ContextWrapperFunction = () => Promise<Context>;

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const connectWithMongoDB = async (
  mongo_url: string,
  db_name: string
): Promise<Db> => {
  const client = new MongoClient(mongo_url);
  try {
    await client.connect();
    return client.db(db_name);
  } catch (error) {
    throw new GraphQLError("Failed to connect to MongoDB", {
      extensions: {
        code: "ECONNREFUSED",
        raw_err_msg: error.message,
      },
    });
  }
};

// Context Wrapper
// Build things you need inside to pass to context
const contextWrapper: ContextWrapperFunction = async () => {
  // Context Metadata
  const mongo_url = process.env.NAACP_MONGODB || "mongodb://mongo:Cca44fB5Ca3eFe6eCcf5HhFBedd1Eh2-@roundhouse.proxy.rlwy.net:20852"; // Local development
  // const mongo_url = process.env.NAACP_MONGODB;
  const dbName = "se_naacp_db";

  return { db: await connectWithMongoDB(mongo_url, dbName) };
};

const { url } = await startStandaloneServer(server, {
  context: contextWrapper,
  listen: { port: (parseInt(process.env.PORT)) || 4000 },
});

console.log(`🚀  Server ready at PORT: ${url}`);
