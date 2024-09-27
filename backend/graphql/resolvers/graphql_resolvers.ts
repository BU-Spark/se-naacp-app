
import {
  INeighborhoods,
  TractsByNeighborhoodArgs,
  ITracts,
  IArticles,
  ILocations,
  DemographicsByTractsArgs,
} from "../types/types";
import { Collection } from "mongodb";
import { clerkMiddleware } from '@clerk/express';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from '../schemas/type_definitions'; 
import { debug } from "console";

const app = express();

//made global middleware for clerk
app.use(clerkMiddleware());

// Helper function to decode JWT from headers
function getUserFromHeaders(req: any) {
  const userHeader = req.headers.user;
  if (!userHeader) {
    throw new Error('Unauthorized');
  }
  const decodedToken = JSON.parse(userHeader as string);
  if (!decodedToken) {
    throw new Error('Unauthorized');
  }
  return decodedToken;
}

// Helper function to check if a string is a number
function isNumber(str: any): boolean {
  return !isNaN(str);
}

// Set up Apollo Server for GraphQL
async function startServer() {
  const server = new ApolloServer({
    typeDefs,  
    resolvers, 
    context: ({ req }) => ({ req }), // Pass the request object to resolvers
  });

  await server.start();
  server.applyMiddleware({ app });

  // Start Express server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();

export const resolvers = {
  Mutation: {
    addRssFeed: async (_, { url, userID }, { db, req, res }) => {
      const decodedToken = getUserFromHeaders(req);

      if (decodedToken.sub !== userID) {
        throw new Error('Forbidden');
      }

      const rss_data = db.collection("rss_links");
      const filter = { userID: userID };
      const update = { $set: { url, userID } };
      const options = { upsert: true, returnDocument: "after" };

      const result = await rss_data.findOneAndUpdate(filter, update, options);
      return result.value;
    },
  },

  Query: {
    getRssLinkByUserId: async (_, args, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);
      console.log(decodedToken);
      const rss_data = db.collection("rss_links");
      const queryResult = await rss_data.find({ userID: decodedToken.sub }).toArray();
      return queryResult || [];
    },

    getUploadByUserId: async (_, args, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const upload_data = db.collection("uploads");
      const queryResult = await upload_data.find({ userID: decodedToken.sub }).toArray();
      return queryResult || [];
    },

    getAllTopics: async (_, args, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const articles_data = db.collection("articles_data");
      const topics = await articles_data.distinct("position_section", { userID: decodedToken.sub });
      return topics || [];
    },

    getAllLabels: async (_, args, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const topic_data = db.collection("articles_data");
      const topics = await topic_data.aggregate([
        { $match: { userID: decodedToken.sub } },
        { $unwind: "$openai_labels" },
        { $group: { _id: null, unique_labels: { $addToSet: "$openai_labels" } } },
      ]).toArray();

      return topics[0]?.unique_labels || [];
    },

    demographicsByTracts: async (_, args: DemographicsByTractsArgs, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const tracts_data: Collection<ITracts> = db.collection("tracts_data");
      const queryResult: ITracts[] = await tracts_data.find({ tract: args.tract, userID: decodedToken.sub }).toArray();
      if (queryResult.length === 0) {
        return [{
          county_name: "",
          tract: args.tract,
          geoid_tract: "",
          neighborhood: "",
          demographics: null,
          articles: null,
        }];
      }

      return queryResult;
    },

    tractsByNeighborhood: async (_, args: TractsByNeighborhoodArgs, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const neighborhood_data: Collection<INeighborhoods> = db.collection("neighborhood_data");
      const queryResult = await neighborhood_data.find({ value: args.neighborhood, userID: decodedToken.sub }).toArray();
      return queryResult || [];
    },

    getAllNeighborhoods: async (_, __, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const neighborhood_data: Collection<INeighborhoods> = db.collection("neighborhood_data");
      const neighborhoods = await neighborhood_data.find({userID: decodedToken.sub}).toArray();
      return neighborhoods || [];
    },

    articleByDate: async (_, args, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const articles_data = db.collection("articles_data");

      const query = {
        dateSum: { $gte: args.dateFrom, $lte: args.dateTo },
        userID: decodedToken.sub,
      };

      if (isNumber(args.area)) {
        query["tracts"] = args.area;
      } else if (args.area !== "all") {
        query["neighborhoods"] = args.area;
      }

      const queryResult = await articles_data.find(query).toArray();
      return queryResult || [];
    },

    orgArticlesPastWeek: async (_, args, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const articles_data = db.collection("articles_data");
      const today = new Date();
      const querydate = new Date(today);
      querydate.setDate(today.getDate() - 7);

      const todaydate = Number(today.toISOString().split("T")[0].split("-").join(""));
      const sevendays = Number(querydate.toISOString().split("T")[0].split("-").join(""));

      const queryResult = await articles_data.find({
        dateSum: { $gte: sevendays, $lte: todaydate },
        userID: decodedToken.sub,
      }).toArray();

      return queryResult || [];
    },

    articleByTopicsOrLabels: async (_, args, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const articles_data = db.collection("articles_data");
      const query = {
        dateSum: { $gte: args.dateFrom, $lte: args.dateTo },
        userID: decodedToken.sub,
        $or: [
          { openai_labels: { $in: [args.labelOrTopic] } },
          { position_section: { $regex: args.labelOrTopic, $options: "i" } },
        ],
      };

      if (isNumber(args.area)) {
        query["tracts"] = args.area;
      } else if (args.area !== "all") {
        query["neighborhoods"] = args.area;
      }

      const queryResult = await articles_data.find(query).toArray();
      return queryResult || [];
    },

    getAllArticles: async (_, __, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const article_data: Collection<IArticles> = db.collection("articles_data");
      const articles = await article_data.find({userID: decodedToken.sub}).toArray();
      return articles || [];
    },

    getArticlesByOrg: async (_, args, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const article_data: Collection<IArticles> = db.collection("articles_data");
      const articles = await article_data.find({ userID: decodedToken.sub}).toArray();
      return articles || [];
    },

    getAllLocations: async (_, __, { db, req }) => {
      const decodedToken = getUserFromHeaders(req);

      const location_data: Collection<ILocations> = db.collection("locations_data");
      const locations = await location_data.find({userID: decodedToken.sub}).toArray();
      return locations || [];
    },
  },
};
