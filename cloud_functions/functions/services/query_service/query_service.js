// Query functions
const functions = require("firebase-functions");
const { query } = require('firebase-admin/firestore');
const util = require('../../util/utilities.js')

// UNOPTIMIZED & NOT YET FAULT TOLERANT (it was quick and dirty)
// Date Query based on Neighborhoods and vice versa Endpoint
// Query Pipeline:
// Query Dates that Satisfies Parameters =>
// Query Neighborhood that Satisfies Parameters =>
// Set intersection and then for each article find all relevant census and topic data =>
// Finally pack data and Resolve
async function queryDateAndNeighborhood(db, queryParameters, MASTER_DATA, verbose){
    const datesRef = db.collection('dates_meta');
    const neighborhoodRef = db.collection('neighborhood_meta');
    const tractRef = db.collection('tracts_meta');
    const topicsRef = db.collection('topics_meta');
    const articlesRef = db.collection('articles_meta');
  
    const SetOfArticleDataDates = new Set();
    const SetOfArticleDataNeigh = new Set();

    const ArrayOfTopicsData = new Array(Object.keys(MASTER_DATA.topics_filter).length).fill(0); 

    util.infoPrinter("MESSAGE!", verbose, functions)

  
    const queryResult = await datesRef
    .where('dateSum', '>=', parseInt(queryParameters.dateFrom))
    .where('dateSum', '<=', parseInt(queryParameters.dateTo)).get().then( (res_dates) => {
      if (res_dates.empty) {
        console.log('[getDateAndNeighborhood] No matching documents in dates.');
        return;
      }  
      // O(N^2), dont like it, point of optimization
      res_dates.forEach( (doc) => {
        doc.data().articles.forEach( (article) => {
          SetOfArticleDataDates.add(article);
        })
      });
    }).then( async () => {
      let neigh = await neighborhoodRef.doc(queryParameters.Neighborhood).get()
      .then( (res_neigh) => {
        if (res_neigh.empty) {
            console.log('[exports.getDateAndNeighborhood] No matching documents in neighborhood.');
            return;
        }  
        res_neigh.data().articles.forEach( (article) => {
          SetOfArticleDataNeigh.add(article);
        });
      });
    }).then( async() => {
        // Intersection of two sets
        let ArrayIntersectArticles = Array.from(new Set([...SetOfArticleDataDates].filter((x) => SetOfArticleDataNeigh.has(x))));

        let promises = [];
        let tractObjs = []; // Array of tract objects
    
        // LIST OF ALL FIREBASE QUERY OBJECTS:
        // Given a article i in Array of Intersection of Articles.
        //
        // tract_data: All Census tract data related to a given i
        // topics_data: Gets the count of how many i's fall into a respective category
        for (let i = 0; i < ArrayIntersectArticles.length; i++) {
            article = ArrayIntersectArticles[i];

            let articleTracts = await articlesRef.doc(article).get().then(async (articleData) => {
                let tracts = articleData.data().tracts;

                for (let j = 0; j < tracts.length; j++) {
                    tractKey = tracts[j];
                    let tractDoc = await tractRef.doc(tractKey).get().then((tractData) => {
                        return tractData.data();
                    });  
                    tractObjs.push(tractDoc);
                };

                let tract_per_article = [];
                Promise.allSettled(tractObjs).then((res) => {
                    // res.push(Promise.reject("Test Rejection"))
                    
                    for (let i = 0; i < res.length; i++) {
                      let tract = res[i];
                      if (tract.status === "fulfilled") {
                        tract_per_article.push(tract.value);
                      } else {
                        tract.catch( (e) => {
                          if (i > tracts.length || i < tracts.length) {
                            console.log(`
                              [articleTracts] Error: A tract could not be fetched/rejected. Rejection
                              was caught outside of the length of known tracts. Please check your inputs.
                              This error occured for article id ${article}. The raw error is defined as: ${e}.
                            `);
                          } else {
                            console.log(`
                              [articleTracts] Error: A tract could not be fetched/rejected for tract
                              ${tracts[i]}. This error occured for article id ${article}. The raw error is defined as: ${e}.
                            `);
                          }
                          // Future note: try a retry pipeline for that tract if rejection failed (do below)
                        });
                      }
                    }
                });    
                
                let result = {
                  pipeline: "articleTracts",
                  data: tract_per_article,
                };
                
                return result;
            });

            let topics_data = topicsRef.where('articles', 'array-contains', article).get().then( (res_topics) => {
                if (res_topics.empty) {
                    console.log("[exports.getDateAndNeighborhood] No matching articles in topics data.");
                    return;
                }

                let data_topics_id = res_topics.docs[0].id;
                if (data_topics_id === 'education'){
                    ArrayOfTopicsData[0] = ArrayOfTopicsData[0] + 1;
                } else if (data_topics_id === 'local') {
                    ArrayOfTopicsData[1] = ArrayOfTopicsData[1] + 1;
                } else if (data_topics_id === 'politics') {
                    ArrayOfTopicsData[2] = ArrayOfTopicsData[2] + 1;
                } else if (data_topics_id === 'opinion') {
                    ArrayOfTopicsData[3] = ArrayOfTopicsData[3] + 1;
                }
                
                let result = {
                  pipeline: "topics_data",
                  data: ArrayOfTopicsData,
                };
                return result;
            });

            promises.push(topics_data, articleTracts);
        };

        const dataResult = Promise.allSettled(promises).then((res) => {
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
  return (Promise.resolve(queryResult).then(r => {return r}))
};


async function queryArticleKeys(db, queryParameters){
    const articlesRef = db.collection('articles_meta');
    const articleKeys = Object.values(queryParameters.articleData);
    const articleValues = []
  
    for (const articleKey of articleKeys) {
      const doc = await articlesRef.doc(articleKey).get()
      .then(res => {
        if (res.empty) {
          console.log(`[exports.getArticleData] Article ${articleKey} not found.`);
          return;
        }
  
        let data_article = res.data();
        return data_article;
      })
      articleValues.push(doc)
      // console.log("ArticleValues are : ", articleValues)
    }
  
    // console.log("ArticleValues are : ", articleValues)

    return articleValues
}


module.exports = { queryDateAndNeighborhood, queryArticleKeys }