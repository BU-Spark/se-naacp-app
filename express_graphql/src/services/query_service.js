const { MongoClient } = require('mongodb');
const { buildSchema } = require("graphql");

const { mongoError } = require("../utilities/error_builder.js");
const { infoLogger, warningLogger } = require("../utilities/loggers.js");

const url = 'mongodb://localhost:27017'; // Will be automated...
const dbName = 'se_naacp_gbh'; // Will be automated...
const client = new MongoClient(url);

const querySchema = buildSchema(`
  type Query {
    queryDateAndNeighborhood(
      dateFrom: Int, 
      dateTo: Int, 
      neighborhood: String
      ): String
    queryArticleKeys(
      queryParameters: String
    ): String
  }
`);


const queryResolver = {
  queryDateAndNeighborhood: async ({dateFrom, dateTo, neighborhood}) => { // Remember to use the deconstructor operator
    await client.connect();
    infoLogger("[queryDateAndNeighborhood]", `Querying Pipeline with parameters: dateFrom: ${dateFrom}, dateTo: ${dateTo}, neighborhood: ${neighborhood}`);

    const SetOfArticleDataDates = new Set();
    const SetOfArticleDataNeigh = new Set();

    try {  
      const db = client.db(dbName);
      const articleCollection = db.collection("articles_data");
      const tractCollection = db.collection("tracts_data");
      const topicsCollection = db.collection("topics_data");
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

      const queryResult = await Promise.all([dateCursor.toArray(), neighborhoodCursor.toArray()]).then( async(_res) => {
        if (_res[0].length == 0  || _res[1].length == 0) { // Will write a better guard
          warningLogger(
            "[queryDateAndNeighborhood]", 
            `One of the Query rendered empty. 
            Cannot perform Query further. 
            Please check Query Parameters, returning empty array.
            Dates: ${_res[0].length} Neighborhood: ${_res[1].length}`
          );
          return;
        }

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
        infoLogger("[queryDateAndNeighborhood]", `The amount of intersected articles is ${ArrayIntersectArticles.length} articles.`);

        let documentTopicsCount = await topicsCollection.countDocuments().catch((e) => {
          console.log("[MongoDB Error] Document count failed:", e);
        });

        let queryRes = [];
        let tractObjs = [];
        let topicsCount = new Array(documentTopicsCount).fill(0); 
      
        // LIST OF ALL MONGODB QUERY OBJECTS:
        // Given a article i in Array of Intersection of Articles.
        //
        // tract_data: All Census tract data related to a given i
        // topics_data: Gets the count of how many i's fall into a respective category
        for (let i = 0; i < ArrayIntersectArticles.length; i++) {
          let article_id = ArrayIntersectArticles[i];

          tractObjs = await tract_data(tractCollection, articleCollection, article_id, tractObjs);
          topicsCount = await topics_data(topicsCollection, article_id, topicsCount);
        }
        
        let tractData = {
          pipeline: "articleTracts",
          data: tractObjs,
        };

        let topicsData = {
          pipeline: "topics_data",
          data: topicsCount,
        }

        queryRes.push(tractData, topicsData);

        const dataResult = Promise.allSettled(queryRes).then((res) => {
          let censusStringSet = new Set();
          let data = {
            demographics: {
              counties: [],
              Total_Population: 0,
              Total_H_and_L: 0,
              Total_not_H_and_L: 0,
              Other_Pop: 0,
              White: 0,
              Black: 0,
              American_Indian: 0,
              Asian: 0,
              Pacific_Islander: 0,
              Other: 0
            }
          };
        
          for (const resPromise of res) {
            if (resPromise.status === "fulfilled") {
              pipeline = resPromise.value.pipeline;
              pipelineData = resPromise.value.data;

              switch(pipeline) {
                case "articleTracts":
                  let template = {
                    counties: [],
                    Total_Population: [],
                    Total_H_and_L: [],
                    Total_not_H_and_L: [],
                    Other_Pop: [],
                    White: [],
                    Black: [],
                    American_Indian: [],
                    Asian: [],
                    Pacific_Islander: [],
                    Other: []
                  };

                  for (let i = 0; i < pipelineData.length; i++) {
                    let dataVals = pipelineData[i];
                    let dataString = JSON.stringify(dataVals)
                    if (!(censusStringSet.has(dataString))) {
                      let demographics = dataVals['demographics'];
                      censusStringSet.add(dataString);

                      template.counties.push(dataVals['county_name']);
                      template.Total_Population.push(parseInt(demographics['p2_001n']));
                      template.Total_H_and_L.push(parseInt(demographics['p2_002n']));
                      template.Total_not_H_and_L.push(parseInt(demographics['p2_003n']));
                      template.Other_Pop.push(parseInt(demographics['p2_004n']));
                      template.White.push(parseInt(demographics['p2_005n']));
                      template.Black.push(parseInt(demographics['p2_006n']));
                      template.American_Indian.push(parseInt(demographics['p2_007n']));
                      template.Asian.push(parseInt(demographics['p2_008n']));
                      template.Pacific_Islander.push(parseInt(demographics['p2_009n']));
                      template.Other.push(parseInt(demographics['p2_010n']))                      }
                  };
              
                  const average = (array) => array.reduce((a, b) => a + b) / array.length;

                  for (const key of Object.keys(template)){
                    if (key == 'counties'){
                      data['demographics'].counties = template.counties
                      continue;
                    };
                    if (template[key].length === 0){
                      continue;
                    };
                    data['demographics'][key] = Math.round(average(template[key]));
                  };
                  // console.log("Data after mean: ", data);
                  break;
                case "topics_data":
                  data["topicsData"] = pipelineData
                  break;
                default:
                  console.log("PIPELINE NOT FOUND", pipeline)// Print an error
              };
              data["articleData"] = ArrayIntersectArticles; // Add the articles associated
            } else {
              console.log("A pipeline failed")
              // We could write a retry...
            };
          };

          return data;
        });

        let resolvedData = Promise.resolve(dataResult).then((r) => {
          return r;
        });

        return resolvedData;
      });

      return (Promise.resolve(queryResult).then(r => {return JSON.stringify(r)}));
    } catch(error) {
      console.log(error);
    }

    return queryResult;
  },

  queryArticleKeys: async ({queryParameters}) => {
    await client.connect();

    try {  
      const db = client.db(dbName);
      const articleCollection = db.collection("articles_data");

      // Lot more to be done... 
    } catch(e) {
      console.log("Error:", e);
    }
  },

};

// =========================================================================================================

// Private Method
var topics_data = async(topicsCollection, article_id, topicsCount) => {
  let topics_count = topicsCollection.find(
    {
      articles: `${article_id}`
    }
  );

  await Promise.resolve(topics_count.toArray()).then( (_res) => {
    let data_topics_id = _res[0].value;
    
    if (data_topics_id === 'Arts'){
      topicsCount[0] = topicsCount[0] + 1;
    } else if (data_topics_id === 'Education') {
        topicsCount[1] = topicsCount[1] + 1;
    } else if (data_topics_id === 'Lifestyle') {
        topicsCount[2] = topicsCount[2] + 1;
    } else if (data_topics_id === 'News') {
        topicsCount[3] = topicsCount[3] + 1;
    } else if (data_topics_id === 'Politics') {
      topicsCount[4] = topicsCount[4] + 1;
    } else if (data_topics_id === 'Specials') {
      topicsCount[5] = topicsCount[5] + 1;
    } 
  });

  return topicsCount;
};

// Private Method
var tract_data = async(tractCollection, articleCollection, article_id, tractObjs) => {
  let article_data = articleCollection.find(
    {
      content_id: `${article_id}`
    }
  );

  await Promise.resolve(article_data.toArray()).then( async(res) => {
    let tracts = res[0].tracts;

    for (let j = 0; j < tracts.length; j++) {
      tractKey = tracts[j];
      let tractDoc = tractCollection.find(
        {
          tract: `${tractKey}`
        }
      );

      await Promise.resolve(tractDoc.toArray()).then((res) => {
        tractObjs.push(res[0]);
      });
    };
  });

  return tractObjs;
};

module.exports = {querySchema, queryResolver};