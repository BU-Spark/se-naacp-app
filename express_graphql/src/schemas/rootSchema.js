const { MongoClient } = require('mongodb');
const { buildSchema } = require("graphql");

const { mongoError } = require("../utilities/error_builder.js");

// const url = 'mongodb://localhost:27017'; // Local development
const url = process.env.NAACP_MONGODB; 

const dbName = 'se_naacp_gbh'; 
const client = new MongoClient(url);

const rootSchema = buildSchema(`
  type Query {
    graphQLMongoPing: String
  }
`);

const rootResolver = {
    graphQLMongoPing: async () => {
        let ping = await client.connect().catch((_err) => {
            return `Error pinging: ${_err}`
        }).then((_res) => {
            return `MongoDB Running successful at: ${url}`
        });

        return ping;
    },
};


module.exports = {rootSchema, rootResolver};
