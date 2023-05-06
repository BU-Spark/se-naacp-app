const { MongoClient } = require('mongodb');
const { buildSchema } = require("graphql");

const { mongoError } = require("../utilities/error_builder.js");

const url = 'mongodb://localhost:27017'; // Will be automated...
const dbName = 'se_naacp_gbh'; // Will be automated...
const client = new MongoClient(url);

const masterSchema = buildSchema(`
  type Query {
    getNeighborhoodList: [String]
    getTopicList: [String]
  }
`);

// The root provides a resolver function for each API endpoint
const masterResolver = {
    getNeighborhoodList: async () => {
      await client.connect();
      console.log('[getNeighborhoodList] Fetching Neighborhood List...');

      let queryResult = [];

      try{
        const db = client.db(dbName);
        const neighCollection = db.collection("neighborhood_data");
        queryResult = await neighCollection.distinct("value");
      } catch(error) {
        let err = mongoError("[501] Internal Server Error", 
        "[getNeighborhoodList] Mongo failed to retrieve Master Neighborhood List",
        error,
        );

        return err;
      }

      return queryResult
    },
    getTopicList: async () => {
      await client.connect();
      console.log('[getTopicList] Fetching Topics List...');

      let queryResult = [];
      try{
        const db = client.db(dbName);
        const neighCollection = db.collection("topics_data");
        queryResult = await neighCollection.distinct("value");
      } catch(error) {
        let err = mongoError("[501] Internal Server Error", 
        "[getTopicList] Mongo failed to retrieve Master Topics List",
        error,
        );

        return err;
      }

      return queryResult
    },
};

module.exports = {masterSchema, masterResolver};