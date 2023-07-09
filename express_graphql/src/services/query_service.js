const { MongoClient } = require("mongodb");
const { buildSchema } = require("graphql");

const { mongoError } = require("../utilities/error_builder.js");
const { infoLogger, warningLogger } = require("../utilities/loggers.js");

const url = "mongodb://localhost:27017"; // Local development
// const url = process.env.NAACP_MONGODB;
const dbName = "se_naacp_gbh";
const client = new MongoClient(url);

const querySchema = buildSchema(`
  type Query {
    queryDateAndNeighborhood(
      dateFrom: Int, 
      dateTo: Int, 
      neighborhood: String
      ): String
    queryArticleKeys(
      articleData: [String]
    ): String
    queryCensusData(
      dateFrom: Int, 
      dateTo: Int,
      censusTract: String
    ): String
    queryTractsByTerm(
      keyword: String
    ): String
  }
`);

const queryResolver = {
  // queryDateAndNeighborhood (Selects by associated neighborhood and date)
  // PARAMETERS:
  // ------------------------
  // <-- (neighborhood: string)
  // <-- (date from: int)
  // <-- (date to: Int)
  //
  // RETURNS:
  // ------------------------
  // --> (All demographic and topical data associated with neighborhood and date parameters)
  queryDateAndNeighborhood: async ({ dateFrom, dateTo, neighborhood }) => {
    // Remember to use the deconstructor operator
    await client.connect();
    infoLogger(
      "[queryDateAndNeighborhood]",
      `Querying Pipeline with parameters: dateFrom: ${dateFrom}, dateTo: ${dateTo}, neighborhood: ${neighborhood}`
    );

    const SetOfArticleWithAssociatedTracts = new Set();
    const SetOfArticleDataTract = new Set();

    try {
      const db = client.db(dbName);
      const articleCollection = db.collection("articles_data");
      const tractCollection = db.collection("tracts_data");
      const topicsCollection = db.collection("topics_data");
      const datesCollection = db.collection("dates_data");
      const neighborhoodCollection = db.collection("neighborhood_data");

      const dateCursor = datesCollection.find({
        $and: [
          {
            dateSum: {
              $gte: dateFrom,
            },
          },
          {
            dateSum: {
              $lte: dateTo,
            },
          },
        ],
      });

      const neighborhoodCursor = neighborhoodCollection.find({
        value: neighborhood,
      });

      const queryResult = await Promise.all([
        dateCursor.toArray(),
        neighborhoodCursor.toArray(),
      ]).then(async (_res) => {
        if (_res[0].length == 0 || _res[1].length == 0) {
          // Will write a better guard
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
        let tractArticles = _res[1][0].articles;

        for (let i = 0; i < datesData.length; i++) {
          let dateArticles = datesData[i].articles;
          for (let j = 0; j < dateArticles.length; j++) {
            SetOfArticleWithAssociatedTracts.add(dateArticles[j]);
          }
        }

        for (let i = 0; i < tractArticles.length; i++) {
          SetOfArticleDataTract.add(tractArticles[i]);
        }

        let ArrayIntersectArticles = Array.from(
          new Set(
            [...SetOfArticleWithAssociatedTracts].filter((x) =>
              SetOfArticleDataTract.has(x)
            )
          )
        );
        infoLogger(
          "[queryDateAndNeighborhood]",
          `The amount of intersected articles is ${ArrayIntersectArticles.length} articles.`
        );

        let documentTopicsCount = await topicsCollection
          .countDocuments()
          .catch((e) => {
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

          tractObjs = await tract_data(
            tractCollection,
            articleCollection,
            article_id,
            tractObjs
          );
          topicsCount = await topics_data(
            topicsCollection,
            article_id,
            topicsCount
          );
        }

        let tractData = {
          pipeline: "articleTracts",
          data: tractObjs,
        };

        let topicsData = {
          pipeline: "topics_data",
          data: topicsCount,
        };

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
              Other: 0,
            },
          };

          for (const resPromise of res) {
            if (resPromise.status === "fulfilled") {
              pipeline = resPromise.value.pipeline;
              pipelineData = resPromise.value.data;

              switch (pipeline) {
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
                    Other: [],
                  };

                  for (let i = 0; i < pipelineData.length; i++) {
                    let dataVals = pipelineData[i];
                    let dataString = JSON.stringify(dataVals);
                    if (!censusStringSet.has(dataString)) {
                      let demographics = dataVals["demographics"];
                      censusStringSet.add(dataString);

                      template.counties.push(dataVals["county_name"]);
                      template.Total_Population.push(
                        parseInt(demographics["p2_001n"])
                      );
                      template.Total_H_and_L.push(
                        parseInt(demographics["p2_002n"])
                      );
                      template.Total_not_H_and_L.push(
                        parseInt(demographics["p2_003n"])
                      );
                      template.Other_Pop.push(
                        parseInt(demographics["p2_004n"])
                      );
                      template.White.push(parseInt(demographics["p2_005n"]));
                      template.Black.push(parseInt(demographics["p2_006n"]));
                      template.American_Indian.push(
                        parseInt(demographics["p2_007n"])
                      );
                      template.Asian.push(parseInt(demographics["p2_008n"]));
                      template.Pacific_Islander.push(
                        parseInt(demographics["p2_009n"])
                      );
                      template.Other.push(parseInt(demographics["p2_010n"]));
                    }
                  }

                  const average = (array) =>
                    array.reduce((a, b) => a + b) / array.length;

                  for (const key of Object.keys(template)) {
                    if (key == "counties") {
                      data["demographics"].counties = template.counties;
                      continue;
                    }
                    if (template[key].length === 0) {
                      continue;
                    }
                    data["demographics"][key] = Math.round(
                      average(template[key])
                    );
                  }
                  // console.log("Data after mean: ", data);
                  break;
                case "topics_data":
                  data["topicsData"] = pipelineData;
                  break;
                default:
                  console.log("PIPELINE NOT FOUND", pipeline); // Print an error
              }
              data["articleData"] = ArrayIntersectArticles; // Add the articles associated
            } else {
              console.log("A pipeline failed");
              // We could write a retry...
            }
          }

          return data;
        });

        let resolvedData = Promise.resolve(dataResult).then((r) => {
          return r;
        });

        return resolvedData;
      });

      return Promise.resolve(queryResult).then((r) => {
        return JSON.stringify(r);
      });
    } catch (error) {
      console.log(error);
    }

    return queryResult;
  },

  // queryArticleKeys (Selects by Articles)
  // PARAMETERS:
  // ------------------------
  // <-- (Article Array)
  //
  // RETURNS:
  // ------------------------
  // --> (Specific Demographic information & topics of the series of articles)
  queryArticleKeys: async ({ articleData }) => {
    await client.connect();
    infoLogger(
      "[queryArticleKeys]",
      `Querying Pipeline with parameters: articleData: ${articleData}`
    );

    try {
      const db = client.db(dbName);
      const articleCollection = db.collection("articles_data");
      const articleKeys = articleData;

      let articles = [];

      for (const articleKey of articleKeys) {
        const articleCursor = articleCollection.find({
          content_id: articleKey,
        });

        let queryResult = await Promise.resolve(articleCursor.toArray()).then(
          (_res) => {
            return _res;
          }
        );

        articles.push(queryResult);
      }

      return JSON.stringify(articles);

      // Lot more to be done...
    } catch (e) {
      console.log("Error:", e); // Need to resolve this to an error logger
    }
  },

  // queryCensusData (Selects by Census Tracts)
  // PARAMETERS:
  // ------------------------
  // <-- (Date)
  // <-- (Census Tract)
  //
  // RETURNS:
  // ------------------------
  // --> (Specific Demographic information & topics of that census)
  queryCensusData: async ({ dateFrom, dateTo, censusTract }) => {
    await client.connect();
    infoLogger(
      "[queryCensusData]",
      `Querying Pipeline with parameters: dateFrom: ${dateFrom}, dateTo: ${dateTo}, censusTract: ${censusTract}`
    );

    const SetOfArticleWithAssociatedTracts = new Set();
    const SetOfArticleDataTract = new Set();

    try {
      const db = client.db(dbName);
      const tractCollection = db.collection("tracts_data");
      const datesCollection = db.collection("dates_data");
      const topicsCollection = db.collection("topics_data");
      const articleCollection = db.collection("articles_data");

      const dateCursor = datesCollection.find({
        $and: [
          {
            dateSum: {
              $gte: dateFrom,
            },
          },
          {
            dateSum: {
              $lte: dateTo,
            },
          },
        ],
      });

      const tactCursor = tractCollection.find({
        tract: censusTract,
      });

      const queryResult = await Promise.all([
        dateCursor.toArray(),
        tactCursor.toArray(),
      ]).then(async (_res) => {
        if (_res[0].length == 0 || _res[1].length == 0) {
          // Will write a better guard
          warningLogger(
            "[queryCensusData]",
            `One of the Query rendered empty. 
            Cannot perform Query further. 
            Please check Query Parameters, returning empty array.
            Dates: ${_res[0].length} Neighborhood: ${_res[1].length}`
          );
          return;
        }

        let datesData = _res[0];
        let tractArticles = _res[1][0].articles;

        for (let i = 0; i < datesData.length; i++) {
          let dateArticles = datesData[i].articles;
          for (let j = 0; j < dateArticles.length; j++) {
            SetOfArticleWithAssociatedTracts.add(dateArticles[j]);
          }
        }

        for (let i = 0; i < tractArticles.length; i++) {
          SetOfArticleDataTract.add(tractArticles[i]);
        }

        let ArrayIntersectArticles = Array.from(
          new Set(
            [...SetOfArticleWithAssociatedTracts].filter((x) =>
              SetOfArticleDataTract.has(x)
            )
          )
        );
        infoLogger(
          "[queryDateAndNeighborhood]",
          `The amount of intersected articles is ${ArrayIntersectArticles.length} articles.`
        );

        let documentTopicsCount = await topicsCollection
          .countDocuments()
          .catch((e) => {
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

          tractObjs = await tract_data(
            tractCollection,
            articleCollection,
            article_id,
            tractObjs
          );
          topicsCount = await topics_data(
            topicsCollection,
            article_id,
            topicsCount
          );
        }

        let tractData = {
          pipeline: "articleTracts",
          data: tractObjs,
        };

        let topicsData = {
          pipeline: "topics_data",
          data: topicsCount,
        };

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
              Other: 0,
            },
          };

          for (const resPromise of res) {
            if (resPromise.status === "fulfilled") {
              pipeline = resPromise.value.pipeline;
              pipelineData = resPromise.value.data;

              switch (pipeline) {
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
                    Other: [],
                  };

                  for (let i = 0; i < pipelineData.length; i++) {
                    let dataVals = pipelineData[i];
                    let dataString = JSON.stringify(dataVals);
                    if (!censusStringSet.has(dataString)) {
                      let demographics = dataVals["demographics"];
                      censusStringSet.add(dataString);

                      template.counties.push(dataVals["county_name"]);
                      template.Total_Population.push(
                        parseInt(demographics["p2_001n"])
                      );
                      template.Total_H_and_L.push(
                        parseInt(demographics["p2_002n"])
                      );
                      template.Total_not_H_and_L.push(
                        parseInt(demographics["p2_003n"])
                      );
                      template.Other_Pop.push(
                        parseInt(demographics["p2_004n"])
                      );
                      template.White.push(parseInt(demographics["p2_005n"]));
                      template.Black.push(parseInt(demographics["p2_006n"]));
                      template.American_Indian.push(
                        parseInt(demographics["p2_007n"])
                      );
                      template.Asian.push(parseInt(demographics["p2_008n"]));
                      template.Pacific_Islander.push(
                        parseInt(demographics["p2_009n"])
                      );
                      template.Other.push(parseInt(demographics["p2_010n"]));
                    }
                  }

                  const average = (array) =>
                    array.reduce((a, b) => a + b) / array.length;

                  for (const key of Object.keys(template)) {
                    if (key == "counties") {
                      data["demographics"].counties = template.counties;
                      continue;
                    }
                    if (template[key].length === 0) {
                      continue;
                    }
                    data["demographics"][key] = Math.round(
                      average(template[key])
                    );
                  }
                  // console.log("Data after mean: ", data);
                  break;
                case "topics_data":
                  data["topicsData"] = pipelineData;
                  break;
                default:
                  console.log("PIPELINE NOT FOUND", pipeline); // Print an error
              }
              data["articleData"] = ArrayIntersectArticles; // Add the articles associated
            } else {
              console.log("A pipeline failed");
              // We could write a retry...
            }
          }

          return data;
        });

        let resolvedData = Promise.resolve(dataResult).then((r) => {
          return r;
        });

        return resolvedData;
      });

      return Promise.resolve(queryResult).then((r) => {
        return JSON.stringify(r);
      });
    } catch (e) {
      console.log("Error:", e); // Need to resolve this to an error logger
    }
  },

  queryTractsByTerm: async ({ keyword }) => {
    
    await client.connect();
    infoLogger(
      "[queryTractsByTerm]",
      `Querying Pipeline with parameters: keyword ${keyword}`
    );

    const db = client.db(dbName);
    const articleCollection = db.collection("articles_data");
    const tractCollection = db.collection("tracts_data");

    const tractCollectionCursor = tractCollection.aggregate([
      {
        $project: {
          _id: 0,
          tract: 1,
          neighborhood: 1,
        },
      },
    ]);

    let queryResult = await Promise.resolve(
      tractCollectionCursor.toArray()).then((_res) => {
      return _res;
    });

    // let tracts = queryResult.map(function (obj) {
    //   return obj.tract;
    // });

    function getNeighborhoodByTract(tract) {
      var neighborhood = '';
      queryResult.forEach(function(obj) {
        if (obj.tract === tract) {
          neighborhood = obj.neighborhood;
        }
      });
      return neighborhood;
    }


    const articleCollectionCursor = articleCollection.aggregate([
      {
        $match: {
          position_section: keyword,
          tracts: {
            $in: [
              "000102",
              "000804",
              "000805",
              "000806",
              "010103",
              "010206",
              "010300",
              "010404",
              "010405",
              "010600",
              "010702",
              "020200",
              "020301",
              "020302",
              "020304",
              "020305",
              "030200",
              "030301",
              "030302",
              "040100",
              "040200",
              "040300",
              "040600",
              "040801",
              "050101",
              "050300",
              "050600",
              "060501",
              "060604",
              "061201",
              "070102",
              "070104",
              "070201",
              "070202",
              "070301",
              "070302",
              "070501",
              "070801",
              "071101",
              "071201",
              "080100",
              "080401",
              "080601",
              "081001",
              "081102",
              "081301",
              "081302",
              "081700",
              "081800",
              "082000",
              "082100",
              "090901",
              "091001",
              "091200",
              "091600",
              "092000",
              "092101",
              "100500",
              "100700",
              "100900",
              "101102",
              "110104",
              "110106",
              "110401",
              "110403",
              "110502",
              "120201",
              "120400",
              "140102",
              "140300",
              "980900",
              "981100",
              "981300",
              "981501",
              "981700",
              "981800",
            ],
          },
        },
      },
      {
        $unwind: "$tracts",
      },
      {
        $group: {
          _id: "$tracts",
          count: { $sum: 1 },
        },
      },
    ]);

    let tractCount = await Promise.resolve(
      articleCollectionCursor.toArray()
    ).then((_res) => {
      return _res;
    });
    var totalCount = 0;
    tractCount.map(function(item) {
      totalCount += item.count
    });
    
    var updatedResults = tractCount.map(function(item) {
      return {
        name: getNeighborhoodByTract(item._id) + " "+ item._id,
        value: (item.count/totalCount)*100
      };

      // return {
      //   _id: item._id,
      //   count: item.count,
      //   neighborhood: getNeighborhoodByTract(item._id),
      //   percentage: (item.count/totalCount)*100
      // };
    });

    console.log(updatedResults);




    return JSON.stringify(updatedResults);
  },
};

// ================= Private Methods =================

// Private Method
var topics_data = async (topicsCollection, article_id, topicsCount) => {
  let topics_count = topicsCollection.find({
    articles: `${article_id}`,
  });

  await Promise.resolve(topics_count.toArray()).then((_res) => {
    let data_topics_id = _res[0].value;

    if (data_topics_id === "Arts") {
      topicsCount[0] = topicsCount[0] + 1;
    } else if (data_topics_id === "Education") {
      topicsCount[1] = topicsCount[1] + 1;
    } else if (data_topics_id === "Lifestyle") {
      topicsCount[2] = topicsCount[2] + 1;
    } else if (data_topics_id === "News") {
      topicsCount[3] = topicsCount[3] + 1;
    } else if (data_topics_id === "Politics") {
      topicsCount[4] = topicsCount[4] + 1;
    } else if (data_topics_id === "Specials") {
      topicsCount[5] = topicsCount[5] + 1;
    }
  });

  return topicsCount;
};





var tract_data = async (
  tractCollection,
  articleCollection,
  article_id,
  tractObjs
) => {
  let article_data = articleCollection.find({
    content_id: `${article_id}`,
  });

  await Promise.resolve(article_data.toArray()).then(async (res) => {
    let tracts = res[0].tracts;

    for (let j = 0; j < tracts.length; j++) {
      tractKey = tracts[j];
      let tractDoc = tractCollection.find({
        tract: `${tractKey}`,
      });

      await Promise.resolve(tractDoc.toArray()).then((res) => {
        tractObjs.push(res[0]);
      });
    }
  });

  return tractObjs;
};

module.exports = { querySchema, queryResolver };
