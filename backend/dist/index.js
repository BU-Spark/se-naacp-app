import { ApolloServer } from "@apollo/server";
import express from "express";
import { typeDefs } from "./graphql/schemas/type_definitions.js";
import { resolvers } from "./graphql/resolvers/graphql_resolvers.js";
import { MongoClient } from "mongodb";
import { authMiddleware } from "./authMiddleware.js"; // Import your middleware
import { graphqlUploadExpress, GraphQLUpload } from 'graphql-upload-minimal';
import 'dotenv/config';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
const PORT = process.env.PORT || 4000;
// Connect to MongoDB function
const connectWithMongoDB = async (mongo_url, db_name) => {
    const client = new MongoClient(mongo_url);
    try {
        await client.connect();
        return client.db(db_name);
    }
    catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); // Exit if MongoDB connection fails
    }
};
// MongoDB connection variables
const dbName = process.env.DB_NAME;
const mongo_url = process.env.NAACP_MONGODB;
// Function to start the server
async function startServer() {
    const app = express();
    // Apply necessary middlewares
    const allowedOrigins = ['http://localhost:3000', 'https://bu-naacp.up.railway.app'];
    //app.options('*', cors());
    app.use(cors({
        origin: function (origin, callback) {
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        allowedHeaders: ['Content-Type', 'x-org-token', 'Authorization'], // Allow the custom headers
    }));
    // Connect to MongoDB
    const dbInstance = await connectWithMongoDB(mongo_url, dbName);
    app.use(express.json()); // For parsing JSON requests
    app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data
    app.use(authMiddleware);
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // Handle file uploads
    // Initialize Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers: {
            Upload: GraphQLUpload, // Make sure to add the upload scalar
            ...resolvers,
        },
        csrfPrevention: false,
        formatError: (err) => ({ message: err.message }),
    });
    await server.start();
    // Apply the Apollo Server middleware to Express
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => ({
            db: dbInstance,
            req,
            token: req.headers.authorization?.split('Bearer ')[1],
        }),
    }));
    // Start the Express server
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
}
// Start the server
startServer().catch((error) => {
    console.error("Error starting server:", error);
});
