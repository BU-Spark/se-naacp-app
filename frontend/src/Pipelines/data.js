import axios from "axios";
import dayjs from "dayjs";

import { gql, ApolloClient, InMemoryCache } from "@apollo/client";

// Apollo Client Object
const queryURI = "http://localhost:4000/queryValues"; // Will be automated

const clientQuery = new ApolloClient({
	uri: queryURI,
	cache: new InMemoryCache(),
});

// GET request to query given valid date and neighborhood
// ======================================================
// Using Axios Params to send specification
// <-- dateFrom: start date, Date.JS object
// <-- dateTo: end date, Date.JS object
// <-- Neighborhood: Neighborhood as a string
// ======================================================
// --> Returns a resolved void promise
const getgetNeighborhoodAndDateData = async (
  dateFrom,
  dateTo,
  neighborhood
) => {
  let formattedDateFrom = parseInt(dayjs(dateFrom).format("YYYYMMDD"));
  let formattedDateTo = parseInt(dayjs(dateTo).format("YYYYMMDD"));
  let types = [typeof 1, typeof 1, typeof ""]; // It's dirty, but javascript won't let me access the number type
  let given = [
    typeof formattedDateFrom,
    typeof formattedDateTo,
    typeof neighborhood,
  ];

  const QUERY = gql`
    query queryDateAndNeighborhood(
      $formattedDateFrom: Int
      $formattedDateTo: Int
      $neighborhood: String
    ) {
      queryDateAndNeighborhood(
        dateFrom: $formattedDateFrom
        dateTo: $formattedDateTo
        neighborhood: $neighborhood
      )
    }
  `;

  if (!typeChecker(types, given)) {
    console.log("Killed Query before leaving!");
    return;
  }

  neighborhood = neighborhood.charAt(0).toUpperCase() + neighborhood.slice(1); // Might move this on the frontend
  let neigh_date_data;
  let neigh_date_data_dev_page;
  try {
    neigh_date_data = await clientQuery
      .query({
        query: QUERY,
        variables: { formattedDateFrom, formattedDateTo, neighborhood },
      })
      .then((_res) => {
        return _res;
      });

    // Definitely needs error checking and custom apollo type checker here...
    neigh_date_data_dev_page = JSON.stringify(neigh_date_data);
    neigh_date_data = JSON.parse(neigh_date_data.data.queryDateAndNeighborhood); // Need to change this...
  } catch (error) {
    neigh_date_data_dev_page = error;
  }

  return [neigh_date_data, neigh_date_data_dev_page];
};


// GET request to query given valid date and census tract
// ======================================================
// Using Axios Params to send specification
// <-- dateFrom: start date, Date.JS object
// <-- dateTo: end date, Date.JS object
// <-- tract: tract as a string
// ======================================================
// --> Returns a resolved void promise
// const getCensusDateData = async(dateFrom, dateTo, tract) => { 
// 	let formattedDateFrom = dayjs(dateFrom).format('YYYYMMDD');
// 	let formattedDateTo = dayjs(dateTo).format('YYYYMMDD');

// 	const parameter_payload = {
// 		dateFrom: `${formattedDateFrom}`,
// 		dateTo: `${formattedDateTo}`,
// 		Tract: `${tract}`
// 	}

// 	console.log("The Parameter Payload:", parameter_payload);

// 	let tract_date_data = await axios.get(
// 		`http://127.0.0.1:5001/se-naacp-journalism-bias/us-central1/getCensusData`,
// 		{
// 			params: {
// 				QueryParam: parameter_payload
// 			}
// 		}
// 	)
//   	.then(res => {
//     	return res
//   	});

// 	tract_date_data = tract_date_data.data;

// 	console.log("Tract_date_data:", tract_date_data);

// 	return tract_date_data;
// };	

const getArticleData = async (articleData) => {
  const QUERY = gql`
    query queryArticleKeys($articleData: [String]) {
      queryArticleKeys(articleData: $articleData)
    }
  `;

  let article_data;
  let article_data_dev_page;
  try {
    article_data = await clientQuery
      .query({
        query: QUERY,
        variables: { articleData },
      })
      .then((_res) => {
        return _res;
      });

	article_data_dev_page = JSON.stringify(JSON.parse(article_data.data.queryArticleKeys));
    article_data = JSON.parse(article_data.data.queryArticleKeys); // Need to change this...
  } catch (error) {
	article_data_dev_page = error;
  }

  return [article_data,article_data_dev_page];
};


// Private Methods
var typeChecker = (typeArr, given) => {
  if (given.length !== typeArr.length) {
    console.log(
      `[TypeChecker] Bad Arr Length (not equal). Comparing: ${typeArr.length}, ${given.length}`
    );
    return false;
  }

  for (let i = 0; i < typeArr.length; i++) {
    if (typeArr[i] != given[i]) {
      console.log(
        `[TypeChecker] Did not recieve equal types. Expected: ${typeArr[i]}, Given: ${given[i]}.`
      );
      return false;
    }
  }

  return true;
};

const queryMethods = {
  getgetNeighborhoodAndDateData: getgetNeighborhoodAndDateData,
  getArticleData: getArticleData,
  getCensusDateData: getCensusDateData,
};

export default queryMethods;
