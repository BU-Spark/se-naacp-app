import { MongoClient } from "mongodb";
const url = "mongodb://localhost:27017"; // Local development
const dbName = "se_naacp_gbh";
const client = new MongoClient(url);

export const resolvers = {

  Query: {
    articleByDate: () => {
      return "Hi";
    },
    tractsByNeighborhood: async (_, args) => {
      await client.connect();
      let db = client.db(dbName);
      const neighborhood_data = db.collection("neighborhood_data");
      
      const queryResult = neighborhood_data
      .find({
        value: args.neighborhood
      }).toArray();

      return queryResult;
    }
  }
};


