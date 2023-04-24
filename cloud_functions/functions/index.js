const functions = require("firebase-functions");

// Data Populate script
const { populate_first_order_data } = require('./scripts/firestore_populate.js')

// Some context specific functions
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// Custom Config function, I used a class because I don't wanna enable modules
const APIKey = require('./config.js');
const a = new APIKey();

// JSON DATA
const MASTER_DATA = require('./scripts/JSON_data/GBH_NAACP.json');

// Init firestore
initializeApp();

const db = getFirestore();

// To start Emulator for Firebase Functions
// firebase emulators:start

// Population Script
populate_first_order_data(db, MASTER_DATA, 'articles_meta', 'articles');
populate_first_order_data(db, MASTER_DATA, 'dates_meta', 'dates_filter');
populate_first_order_data(db, MASTER_DATA, 'neighborhood_meta', 'neighs_filter');
populate_first_order_data(db, MASTER_DATA, 'topics_meta', 'topics_filter');
populate_first_order_data(db, MASTER_DATA, 'tracts_meta', 'tracts_filter');

// Initalize services
const master_service = require('./services/master_service/master_service.js')
const query_service = require('./services/query_service/query_service.js');


// Initalize util
const util = require('./util/utilities.js')
// ==================================================================================================

// (NEIGHBORHOOD AND CENSUS TRACT MASTER LIST QUERY) [Initialization Endpoint]
// PARAMETERS:
// ------------------------
// None
//
// RETURNS:
// ------------------------
// --> ( A list of neighborhoods & all the associated tracts for each neighborhood )
exports.getNeighborhoodsList = functions.https.onRequest(async (request, response) => {
    let neighborhood_list = master_service.getNeighborhoods(db);

    Promise.resolve(neighborhood_list).then((res) => {
      util.checkLength(res, response);
    });
});

// (TOPICS MASTER LIST QUERY) [Initialization Endpoint]
// PARAMETERS:
// ------------------------
// None
//
// RETURNS:
// ------------------------
// --> (A list of known Topics)
exports.getTopicList = functions.https.onRequest(async (request, response) => {
  let topics_list = master_service.getTopics(db);
  
  Promise.resolve(topics_list).then((res) => {
    util.checkLength(res, response);
  });
});

// (GET DATE AND NEIGHBORHOOD QUERY)
// PARAMETERS:
// ------------------------
// None
//
// RETURNS:
// ------------------------
// --> (A list of known Topics)
exports.queryDateAndNeighborhood = functions.https.onRequest(async (request, response) => {
  const queryParameters = request.query.QueryParam;
  let data = query_service.queryDateAndNeighborhood(db, queryParameters, MASTER_DATA, true);

  Promise.resolve(data).then((data) => {
    util.checkNone(data, response);
  });
});


// (GET ARTICLE DATA QUERY)
// PARAMETERS:
// ------------------------
// <--(ArticleKeys)
//
// RETURNS:
// ------------------------
// --> (A list of known Topics)
exports.queryArticleKeys = functions.https.onRequest(async (request, response) => {
  const queryParameters = request.query.QueryParam;
  let articleValues = query_service.queryArticleKeys(db, queryParameters);
  
  Promise.resolve(articleValues).then((articleValues) => {
    util.checkLength(articleValues, response);
  });
});





///  ====== NEEDS REFACTORING BELOW ======

// (SELECT BY CENSUS TRACT)
// PARAMETERS:
// ------------------------
// <-- (Date)
// <-- (Census Tract)
//
// RETURNS:
// ------------------------
// --> ( Specific Demographic information & topics of that census)
exports.getCensusData = functions.https.onRequest(async (request, response) => {
  const queryParameters = request.query.QueryParam;
  const datesRef = db.collection('dates_meta');
  const tractRef = db.collection('tracts_meta');
  const topicsRef = db.collection('topics_meta');

  const SetOfArticleDataDates = new Set();
  const SetOfArticleDataTract = new Set();

  // [0] Arts, [1] Education, [2] News, [3] Opinion
  const ArrayOfTopicsData = new Array(Object.keys(MASTER_DATA.topics_filter).length).fill(0); 

  const data = {
    demographics: "None", 
    topicsData: "None",
    censusTracts: "None",
    articleData: "None"
  };

  const queryResult = await datesRef
  .where('dateSum', '>=', parseInt(queryParameters.dateFrom))
  .where('dateSum', '<=', parseInt(queryParameters.dateTo)).get().then( (res_dates) => {
    if (res_dates.empty) {
      console.log('[exports.getDateAndNeighborhood] No matching documents in dates.');
      return;
    }  
    // O(N^2), dont like it, point of optimization
    res_dates.forEach( (doc) => {
      doc.data().articles.forEach( (article) => {
        SetOfArticleDataDates.add(article);
      })
    });
  }).then( async () => {
    let t = await tractRef.doc(queryParameters.Tract).get()
    .then( (res_tract) => {
      if (res_tract.data() === undefined) {
        console.log('[exports.getDateAndNeighborhood] No matching documents in neighborhood.');
        return;
      }  

      data.demographics = {
        counties: `${res_tract.data().county_name}`,
        Total_Population: `${res_tract.data().demographics.p2_001n}`,
        Total_H_and_L: `${res_tract.data().demographics.p2_002n}`,
        Total_not_H_and_L: `${res_tract.data().demographics.p2_003n}`,
        Other_Pop: `${res_tract.data().demographics.p2_004n}`,
        White: `${res_tract.data().demographics.p2_005n}`,
        Black: `${res_tract.data().demographics.p2_006n}`,
        American_Indian: `${res_tract.data().demographics.p2_007n}`,
        Asian: `${res_tract.data().demographics.p2_008n}`,
        Pacific_Islander: `${res_tract.data().demographics.p2_009n}`,
        Other: `${res_tract.data().demographics.p2_010n}`
      }

      res_tract.data().articles.forEach( (article) => {
        SetOfArticleDataTract.add(article);
      });

    });
  }).finally( async () => {
    let ArrayIntersectArticles = Array.from(new Set([...SetOfArticleDataDates].filter((x) => SetOfArticleDataTract.has(x))));
    let topicsCount = [];

    // Find relevant data with each article
    for (let i = 0; i < ArrayIntersectArticles.length; i++) {
      // THIS NEEDS TO BE REFACTORED
      // Demographic Data for all the tracts
      let topics_data = topicsRef.where('articles', 'array-contains', ArrayIntersectArticles[i]).get().then( (res_topics) => {
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

        return ArrayOfTopicsData;
      });

      topicsCount = topics_data;
    } // For each Article

    let packing = Promise.resolve(topicsCount).then((v) => {
      data.topicsData = v;
      data.articleData = ArrayIntersectArticles;

      // Send the data
      if (data.censusData != 'None' && data.topicsData != 'None') {
        response.set('Access-Control-Allow-Origin', '*');
        response.send(JSON.stringify(data));
        response.end();
      } else {
        response.set('Access-Control-Allow-Origin', '*');
        response.send("Error 501: [exports.getDateAndNeighborhood] Collections Not Found!");
        response.end();
      }

      return data;
    });
  });

  
});