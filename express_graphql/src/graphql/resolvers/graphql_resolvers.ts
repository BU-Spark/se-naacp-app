import { MongoClient, Db, Collection } from "mongodb";
import { INeighborhoods, TractsByNeighborhoodArgs } from "../types/types";

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
    tractsByNeighborhood: async (_, args: TractsByNeighborhoodArgs): Promise<INeighborhoods[]> => {
      await client.connect();
      let db: Db = client.db(dbName);
      const neighborhood_data: Collection<INeighborhoods> = db.collection("neighborhood_data");

      const queryResult: INeighborhoods[] = await neighborhood_data
        .find({
          value: args.neighborhood
        }).toArray();

      return queryResult;
    },
    demographicsByTracts: async (_, args) => {
      await client.connect();
      let db = client.db(dbName);
      const tracts_data = db.collection("tracts_data");

      const queryResult = tracts_data
        .find({
          tract: args.tract
        }).toArray();
      return queryResult;
    }
  }
};