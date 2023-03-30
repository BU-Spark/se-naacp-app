const functions = require("firebase-functions");

// Data Populate script
const { populate_first_order_data } = require('./scripts/firestore_populate.js')

// Some context specific functions
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

// Custom Config function, I used a class because I don't wanna enable modules
const APIKey = require('./config.js');
const a = new APIKey();

// JSON DATA
const MASTER_DATA = require('./scripts/JSON_data/NAACP_Updated.json');

// Init firestore
initializeApp();

const db = getFirestore();

// To start Emulator for Firebase Functions
// firebase emulators:start

// Population Script
populate_first_order_data(db, MASTER_DATA, 'articles_meta', 'articles');
populate_first_order_data(db, MASTER_DATA, 'dates_meta', 'dates_filter');
populate_first_order_data(db, MASTER_DATA, 'subneighborhood_meta', 'neighs_filter');
populate_first_order_data(db, MASTER_DATA, 'topics_meta', 'topics_filter');
populate_first_order_data(db, MASTER_DATA, 'tracts_meta', 'tracts_filter');

// Neighborhood Master List Query Endpoint
exports.getSubNeighborhoods = functions.https.onRequest(async (request, response) => {
    sn_list = [];

    const neighborhoodRef = db.collection('subneighborhood_meta');
    const sn_response = await neighborhoodRef.get();
    sn_response.forEach( (doc) => {
      sn_list.push(doc.id);
      console.log("The Neighborhood data:", doc.data());
    });

    if (sn_list.length != 0) {
        response.set('Access-Control-Allow-Origin', '*'); // Quick and dirty way of doing CORS
        response.send(JSON.stringify(sn_list));
        response.end();
    } else {
        response.set('Access-Control-Allow-Origin', '*');
        response.send("Error 404: [exports.getSubNeighborhoods] Data Not Found!");
        response.end();
    }
});

// Gets all possible topics to construct a topics master list
exports.getTopicList = functions.https.onRequest(async (request, response) => {
  topics_list = [];

  const topicsRef = db.collection('topics_meta');
  const topics_response = await topicsRef.get();
  topics_response.forEach( (doc) => {
    topics_list.push(doc.id);
  });

  if (topics_list.length != 0) {
    response.set('Access-Control-Allow-Origin', '*'); // Quick and dirty way of doing CORS
    response.send(JSON.stringify(topics_list));
    response.end();
  } else {
    response.set('Access-Control-Allow-Origin', '*');
    response.send("Error 404: [exports.getTopicList] Data Not Found!");
    response.end();
  }
});

// UNOPTIMIZED & NOT YET FAULT TOLERANT (it was quick and dirty)
// Date Query based on Subneighborhoods and vice versa Endpoint
// Query Pipeline:
// Query Dates that Satisfies Parameters =>
// Query Neighborhood that Satisfies Parameters =>
// Set intersection and then for each article find all relevant census and topic data =>
// Finally pack data and Resolve
exports.getDateAndNeighborhood = functions.https.onRequest(async (request, response) => {
  const queryParameters = request.query.QueryParam;
  const datesRef = db.collection('dates_meta');
  const neighborhoodRef = db.collection('subneighborhood_meta');
  const tractRef = db.collection('tracts_meta');
  const topicsRef = db.collection('topics_meta');

  const SetOfArticleDataDates = new Set();
  const SetOfArticleDataNeigh = new Set();

  const ArrayOfCensusData = [];
  const ArrayOfCensusTracts = [];
  // [0] Arts, [1] Education, [2] News, [3] Opinion
  const ArrayOfTopicsData = new Array(Object.keys(MASTER_DATA.topics_filter).length).fill(0); 

  const data = {
    censusData: "None", 
    topicsData: "None",
    censusTracts: "None",
    articles: "None"
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
  }).finally( async () => {
    // Intersection of two sets
    // console.log("The Articles of Dates:", SetOfArticleDataDates)
    // console.log("The Articles of Neighborhood:", SetOfArticleDataNeigh);
    let ArrayIntersectArticles = Array.from(new Set([...SetOfArticleDataDates].filter((x) => SetOfArticleDataNeigh.has(x))));
    // console.log("Intersection:", ArrayIntersectArticles);

    // Find relevant data with each article
    ArrayIntersectArticles.forEach( (article) => {

        // THIS NEEDS TO BE REFACTORED
        // Demographic Data for all the tracts
        let tract_data = tractRef.where('articles', 'array-contains', article).get().then( (res_tract) => {
          if (res_tract.empty) {
            console.log("[exports.getDateAndNeighborhood] No matching articles in census data.");
            return;
          }

          let data_tract = res_tract.docs[0].data();
          console.log("Tract Data:", data_tract.county_name);
          return ({county: `${data_tract.county_name}`,demographics: data_tract.demographics});
        }); 

        // Get the tracts themselves
        let raw_tract_data = tractRef.where('articles', 'array-contains', article).get().then( (res_tract) => {
          if (res_tract.empty) {
            console.log("[exports.getDateAndNeighborhood] No matching articles in census data.");
            return;
          }

          let data_tract = res_tract.docs[0].data();
          return ({id: `${res_tract.docs[0].id}`,county: `${data_tract.county_name}`,demographics: data_tract.demographics});
        }); 

        let topics_data = topicsRef.where('articles', 'array-contains', article).get().then( (res_topics) => {
          if (res_topics.empty) {
            console.log("[exports.getDateAndNeighborhood] No matching articles in topics data.");
            return;
          }

          // console.log("Looking at topics article:", article);
          let data_topics_id = res_topics.docs[0].id;
          if (data_topics_id === 'arts'){
            ArrayOfTopicsData[0] = ArrayOfTopicsData[0] + 1;
          } else if (data_topics_id === 'education') {
            ArrayOfTopicsData[1] = ArrayOfTopicsData[1] + 1;
          } else if (data_topics_id === 'news') {
            ArrayOfTopicsData[2] = ArrayOfTopicsData[2] + 1;
          } else if (data_topics_id === 'opinion') {
            ArrayOfTopicsData[3] = ArrayOfTopicsData[3] + 1;
          }
          return ArrayOfTopicsData;
        });

        ArrayOfCensusData.push(tract_data);
        ArrayOfCensusTracts.push(raw_tract_data);
    });    

    // Parse and Pack data payload (Census Data)
    // First Round of packing (Census Data & Topics Counter)
    let packing = Promise.allSettled(ArrayOfCensusData).then((r) => {
      // index 0 - k, where follows the order: p2_001n, p2_002n, ... ,p2_001kn
      let demoArr = new Array(10).fill(0); 
      let countyInfo = [];

      r.forEach( (demographic) => {
        if (!countyInfo.includes(demographic.value.county)) {
          countyInfo.push(demographic.value.county);
        }

        demoArr[0] = parseInt(demographic.value.demographics.p2_001n) + demoArr[0];
        demoArr[1] = parseInt(demographic.value.demographics.p2_002n) + demoArr[1];
        demoArr[2] = parseInt(demographic.value.demographics.p2_003n) + demoArr[2];
        demoArr[3] = parseInt(demographic.value.demographics.p2_004n) + demoArr[3];
        demoArr[4] = parseInt(demographic.value.demographics.p2_005n) + demoArr[4];
        demoArr[5] = parseInt(demographic.value.demographics.p2_006n) + demoArr[5];
        demoArr[6] = parseInt(demographic.value.demographics.p2_007n) + demoArr[6];
        demoArr[7] = parseInt(demographic.value.demographics.p2_008n) + demoArr[7];
        demoArr[8] = parseInt(demographic.value.demographics.p2_009n) + demoArr[8];
        demoArr[9] = parseInt(demographic.value.demographics.p2_010n) + demoArr[9];
      });

      // Take the mean across the census data
      for(var i = 0; i < demoArr.length; i++) {
        demoArr[i] = demoArr[i] / demoArr.length;
      }

      data.topicsData = ArrayOfTopicsData;
      data.articles = ArrayIntersectArticles

      data.censusData = {
        counties: `${countyInfo}`,
        Total_Population: `${demoArr[0]}`,
        Total_H_and_L: `${demoArr[1]}`,
        Total_not_H_and_L: `${demoArr[2]}`,
        Other_Pop: `${demoArr[3]}`,
        White: `${demoArr[4]}`,
        Black: `${demoArr[5]}`,
        American_Indian: `${demoArr[6]}`,
        Asian: `${demoArr[7]}`,
        Pacific_Islander: `${demoArr[8]}`,
        Other: `${demoArr[9]}`
      }

      return data;
    });

    // Second Round of packing (Census Tracts specific to the parameters)
    packing = Promise.allSettled(ArrayOfCensusData).then((r) => {
      let tractList = [];
      r.forEach((census) => {
        tractList.push(census.value);
      });
      data.censusTracts = tractList;
      return data;
    });

    return packing;
  });

  console.log("The Resultant data:", data);

  if (data.censusData != 'None' || data.topicsData != 'None' || data.censusTracts != 'None') {
    response.set('Access-Control-Allow-Origin', '*');
    response.send(JSON.stringify(data));
    response.end();
  } else if (data.censusData == 'None' && data.topicsData == 'None' && data.censusTracts == 'None') {
    response.set('Access-Control-Allow-Origin', '*');
    response.send(JSON.stringify(data));
    response.end();
  } else {
    response.set('Access-Control-Allow-Origin', '*');
    response.send("Error 501: [exports.getDateAndNeighborhood] Collections Not Found!");
    response.end();
  }

});

// Place holder for Query Demographic Information from tracts (Random)
exports.getCensusData = functions.https.onRequest(async (request, response) => {
  let some_Census_data_nums = ['071201', '358100', '981800', '731700', '000302'];
  let randomIndex = Math.floor(Math.random() * (4 - 0 + 1) + 0);

  const tractsRef = db.collection('tracts_meta').doc(some_Census_data_nums[randomIndex]);
  const tract_response = await tractsRef.get().then(
    (value) => {
      if (value.data() !== undefined) {
        console.log('Census data:', value.data());
        response.set('Access-Control-Allow-Origin', '*'); // Quick and dirty way of doing CORS
        response.send(JSON.stringify(value.data()));
        response.end();
      } else {
          response.set('Access-Control-Allow-Origin', '*');
          response.send("Error 404: [exports.getCensusData] Data Not Found!");
          response.end();
      }
    }
  )
});
