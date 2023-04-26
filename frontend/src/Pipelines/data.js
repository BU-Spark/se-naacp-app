import axios from 'axios';
import dayjs from 'dayjs';

// GET request to query given valid date and neighborhood
// Using Axios Params to send specification
// <-- dateFrom: start date, Date.JS object
// <-- dateTo: end date, Date.JS object
// <-- Neighborhood: Neighborhood as a string
// --> Returns a resolved void promise
const getNeighborhoodAndDateData = async(dateFrom, dateTo, Neighborhood) => { 
	let formattedDateFrom = dayjs(dateFrom).format('YYYYMMDD');
	let formattedDateTo = dayjs(dateTo).format('YYYYMMDD');

	const parameter_payload = {
		dateFrom: `${formattedDateFrom}`,
		dateTo: `${formattedDateTo}`,
		Neighborhood: `${Neighborhood}`
	}

	console.log("The Parameter Payload:", parameter_payload);

	let neigh_date_data = await axios.get(
		`http://127.0.0.1:5001/se-naacp-journalism-bias/us-central1/queryDateAndNeighborhood`,
		{
			params: {
				QueryParam: parameter_payload
			}
		}
	)
  	.then(res => {
    	return res
  	}).catch((error) => {
		return {header: "Internal Server Error!", reason: error}
	});

	// if (neigh_date_data.header.includes("Error")) {
	// 	console.log("ERROR HAS OCCURED!");
	// } else {
	// 	neigh_date_data = neigh_date_data.data;
	// }

	neigh_date_data = neigh_date_data.data;

	return neigh_date_data;
};	


// GET request to query given valid date and census tract
// ======================================================
// Using Axios Params to send specification
// <-- dateFrom: start date, Date.JS object
// <-- dateTo: end date, Date.JS object
// <-- tract: tract as a string
// ======================================================
// --> Returns a resolved void promise
const getCensusDateData = async(dateFrom, dateTo, tract) => { 
	let formattedDateFrom = dayjs(dateFrom).format('YYYYMMDD');
	let formattedDateTo = dayjs(dateTo).format('YYYYMMDD');

	const parameter_payload = {
		dateFrom: `${formattedDateFrom}`,
		dateTo: `${formattedDateTo}`,
		Tract: `${tract}`
	}

	console.log("The Parameter Payload:", parameter_payload);

	let tract_date_data = await axios.get(
		`http://127.0.0.1:5001/se-naacp-journalism-bias/us-central1/getCensusData`,
		{
			params: {
				QueryParam: parameter_payload
			}
		}
	)
  	.then(res => {
    	return res
  	});

	tract_date_data = tract_date_data.data;

	console.log("Tract_date_data:", tract_date_data);

	return tract_date_data;
};	


const getArticleData = async(articleData) => {
	const parameter_payload = {
		articleData: articleData
	}

	let article_data = await axios.get(
		`http://127.0.0.1:5001/se-naacp-journalism-bias/us-central1/queryArticleKeys`,
		{
			params: {
				QueryParam: parameter_payload
			}
		}
	)
	.then(res => {
		return res
	});

	article_data = article_data.data;
	return article_data
}


const queryMethods = {
	getNeighborhoodAndDateData: getNeighborhoodAndDateData,
	getArticleData: getArticleData,
	getCensusDateData: getCensusDateData
}


export default queryMethods
