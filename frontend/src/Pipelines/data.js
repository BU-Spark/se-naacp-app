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
		`http://127.0.0.1:5001/se-naacp-journalism-bias/us-central1/getDateAndNeighborhood`,
		{
			params: {
				QueryParam: parameter_payload
			}
		}
	)
  	.then(res => {
    	return res
  	});

	neigh_date_data = neigh_date_data.data;
	return neigh_date_data;
};	


const queryMethods = {
	getNeighborhoodAndDateData: getNeighborhoodAndDateData
}


export default queryMethods
