import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import express from "express";
import { typeDefs } from "./graphql/schemas/type_definitions.js";
import { resolvers } from "./graphql/resolvers/graphql_resolvers.js";
import { MongoClient } from "mongodb";
import { GraphQLError } from "graphql";
import { authMiddleware } from "./authMiddleware.js"; // Import your middleware
import { GraphQLUpload } from 'graphql-upload-minimal';
import { graphqlUploadExpress } from 'graphql-upload-minimal';
import 'dotenv/config';
// Connect to MongoDB
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
const dbName = process.env.DB_NAME;
const mongo_url = process.env.NAACP_MONGODB;
let dbInstance = await connectWithMongoDB(mongo_url, dbName);
// Create an Express application
const app = express();
// Apply your auth middleware to all requests
app.use(authMiddleware);
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
// Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers: {
        ...resolvers,
        Upload: GraphQLUpload,
    },
    formatError: (err) => {
        return { message: err.message };
    },
});
// Start the Apollo Server using startStandaloneServer
const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => ({
        db: dbInstance,
        req,
        token: req.headers.authorization?.split('Bearer ')[1],
    }),
    listen: { port: parseInt(process.env.PORT) || 4000 },
});
console.log(`🚀  Server ready at PORT: ${url}`);
