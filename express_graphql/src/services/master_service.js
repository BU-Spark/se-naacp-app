const { MongoClient } = require('mongodb');
const { buildSchema } = require("graphql");

const { mongoError } = require("../utilities/error_builder.js");

const url = 'mongodb://localhost:27017'; // Local development
// const url = process.env.NAACP_MONGODB;
const dbName = 'se_naacp_gbh'; 
const client = new MongoClient(url);

const masterSchema = buildSchema(`
  type Query {
    getNeighborhoodList: String
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
        let neighborhoodCursor = await neighCollection.find({});

        queryResult = await Promise.resolve(neighborhoodCursor.toArray()).then((_res) => {
          let neighAndTract = [];

          // Need to change this to a reject furfill block...
          if (_res.length === 0) {
            console.log("[getNeighborhoodList] WARNING: Query Result is Empty!")
          } else if (_res === null) {
            let err = mongoError("[501] Internal Server Error", 
            "GraphQL Resolver suffered an Error. Please check MongoDB or API.",
            );
            return err
          }

          for (let i = 0; i < _res.length; i++) {
            let neighborhoodDataBlock = {
              neighborhood: `${_res[i].value}`,
              tracts: _res[i].tracts
            }
            neighAndTract.push(neighborhoodDataBlock);
          }

          return neighAndTract;
        });
        
      } catch(error) {
        let err = mongoError("[502] Internal Mongo Error", 
        "[getNeighborhoodList] Mongo failed to retrieve Master Neighborhood List",
        error,
        );

        return err;
      }

      queryResult = JSON.stringify(queryResult);
      return queryResult
    },
    getTopicList: async () => {
      await client.connect();
      console.log('[getTopicList] Fetching Topics List...');

      let queryResult = [];
      try{
        const db = client.db(dbName);
        const topicsCollection = db.collection("topics_data");
        queryResult = await topicsCollection.distinct("value").then((val) => {
          if (val.length === 0) {
            console.log("[getTopicList] WARNING: Query Result is Empty!")
          } else if (val === null) {
            let err = mongoError("[501] Internal Server Error", 
            "GraphQL Resolver suffered an Error. Please check MongoDB or API.",
            );

            return err
          }

          return val;
        });
        
      } catch(error) {
        let err = mongoError("[502] Internal Mongo Error", 
        "[getTopicList] Mongo failed to retrieve Master Topics List",
        error,
        );

        return err;
      }

      return queryResult
    },
};

module.exports = {masterSchema, masterResolver};