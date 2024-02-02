import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/schemas/type_definitions.js";
import { resolvers } from "./graphql/resolvers/graphql_resolvers.js";
import { MongoClient } from "mongodb";
import { GraphQLError } from "graphql";
// Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const connectWithMongoDB = async (mongo_url, db_name) => {
    const client = new MongoClient(mongo_url);
    try {
        await client.connect();
        return client.db(db_name);
    }
    catch (error) {
        throw new GraphQLError("Failed to connect to MongoDB", {
            extensions: {
                code: "ECONNREFUSED",
                raw_err_msg: error.message,
            },
        });
    }
};
const mongo_url = process.env.NAACP_MONGODB || "mongodb://localhost:27017";
const dbName = "se_naacp_db";
let x = await connectWithMongoDB(mongo_url, dbName);
// Context Wrapper
// Build things you need inside to pass to context
const contextWrapper = async () => {
    // Context Metadata
    return { db: x };
};
const { url } = await startStandaloneServer(server, {
    context: contextWrapper,
    listen: { port: parseInt(process.env.PORT) || 4000 },
});
console.log(`🚀  Server ready at PORT: ${url}`);
