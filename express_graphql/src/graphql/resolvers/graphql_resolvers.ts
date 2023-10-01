import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017"; // Local development
const dbName = "se_naacp_gbh";
const client = new MongoClient(url);

//helper function to check if a string is a numebr
function isNumber(str: any) {
  return !isNaN(str);
}

export const resolvers = {
  Query: {
    articleByDate: async (parent, args, contex) => {
      await client.connect();
      let db = client.db(dbName);
      const articles_data = db.collection("articles_data");

      if (isNumber(args.area)) {
        const queryResult = articles_data
          .find({
            dateSum: {
              $gte: args.dateFrom,
              $lte: args.dateTo,
            },
            tracts: args.area,
          })
          .toArray();

        return queryResult;
      } else {
        const queryResult = articles_data
          .find({
            dateSum: {
              $gte: args.dateFrom,
              $lte: args.dateTo,
            },
            neighborhoods: args.area,
          })
          .toArray();

        return queryResult;
      }
    },
  },
};
