const { MongoClient } = require('mongodb');
const { buildSchema } = require("graphql");

const { mongoError } = require("../utilities/error_builder.js");

const url = 'mongodb://localhost:27017'; // Will be automated...
const dbName = 'se_naacp_gbh'; // Will be automated...
const client = new MongoClient(url);

const querySchema = buildSchema(`
  type Query {
    queryDateAndNeighborhood(
      dateFrom: Int, 
      dateTo: Int, 
      neighborhood: String
      ): [String]
  }
`);


const queryResolver = {
  queryDateAndNeighborhood: async ({dateFrom, dateTo, neighborhood}) => { // Remember to use the deconstructor operator
    await client.connect();
    console.log('[queryDateAndNeighborhood] Fetching Parameters List...');

    let queryResult = [];
    const SetOfArticleDataDates = new Set();
    const SetOfArticleDataNeigh = new Set();

    try {  
      const db = client.db(dbName);
      const datesCollection = db.collection("dates_data");
      const neighborhoodCollection = db.collection("neighborhood_data");

      const dateCursor = datesCollection.find(
        {'$and': [
            {
              'dateSum': {
                '$gte': dateFrom
              }
            }, {
              'dateSum': {
                '$lte': dateTo
              }
            }
          ]
        }
      );

      const neighborhoodCursor = neighborhoodCollection.find(
        {
          'value': neighborhood
        }
      );

      await Promise.all([dateCursor.toArray(), neighborhoodCursor.toArray()]).then((_res) => {
        let datesData = _res[0];
        let neighArticles = _res[1][0].articles;

        for (let i = 0; i < datesData.length; i++) {
          let dateArticles = datesData[i].articles;
            for (let j = 0; j < dateArticles.length; j++) {
              SetOfArticleDataDates.add(dateArticles[j]);
            } 
        };

        for (let i = 0; i < neighArticles.length; i++) {
          SetOfArticleDataNeigh.add(neighArticles[i]);
        }

        let ArrayIntersectArticles = Array.from(new Set([...SetOfArticleDataDates].filter((x) => SetOfArticleDataNeigh.has(x))));
        console.log("INTERSECTION:", ArrayIntersectArticles);

        

      });

    } catch(error) {
      console.log(error);
    }

    return queryResult;
  },

};

module.exports = {querySchema, queryResolver};