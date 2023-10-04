import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017"; // Local development
const dbName = "se_naacp_gbh";
const client = new MongoClient(url);

export const resolvers = {
  Query: {
    articleByDate: async (parent, args, contex) => {
      await client.connect();
      let db = client.db(dbName);
      const articles_data = db.collection("articles_data");

      const queryResult = articles_data
        .find({
          dateSum: {
            $gte: args.dateFrom,
            $lte: args.dateTo,
          },
          neighborhoods: args.neighborhood,
        })
        .toArray();

      return queryResult;
    },
  },
};
