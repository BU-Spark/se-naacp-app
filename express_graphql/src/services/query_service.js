const { MongoClient } = require('mongodb');
const { buildSchema } = require("graphql");

const { mongoError } = require("../utilities/error_builder.js");

const url = 'mongodb://localhost:27017'; // Will be automated...
const dbName = 'se_naacp_gbh'; // Will be automated...
const client = new MongoClient(url);

const querySchema = buildSchema(`
  type Query {
    getNeighborhoodList: [String]
    getTopicList: [String]
  }
`);