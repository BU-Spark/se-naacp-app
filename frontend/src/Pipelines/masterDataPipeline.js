import axios from 'axios';

const getInitData = async() => {
  let message_neigh_list = await axios.get(`http://127.0.0.1:5001/se-naacp-journalism-bias/us-central1/getSubNeighborhoods`)
  .then(res => {
    return res
  });

  let message_inital_demographic = await axios.get(`http://127.0.0.1:5001/se-naacp-journalism-bias/us-central1/getCensusData`)
  .then(res => {
    return res
  });

  // Set in raw data format
  message_neigh_list = message_neigh_list.data;
  message_inital_demographic = message_inital_demographic.data;

  console.log("The Sent Response NEIGHBORHOOD:", message_neigh_list);
  console.log("The Sent Response CENSUS/DEMOGRAPHIC:", message_inital_demographic);
  
  return message_neigh_list
}

const listenerMethods = {
  getInitData: getInitData
}

export default listenerMethods