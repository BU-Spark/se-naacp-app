import axios from 'axios';

const getInitData = async() => {
  let message_neigh_list = await axios.get(`http://127.0.0.1:5001/se-naacp-journalism-bias/us-central1/getSubNeighborhoods`)
  .then(res => {
    return res;
  });

  let message_topics_list = await axios.get('http://127.0.0.1:5001/se-naacp-journalism-bias/us-central1/getTopicList')
  .then(res => {
    return res;
  });

  // Set in raw data format
  message_neigh_list = message_neigh_list.data;
  message_topics_list = message_topics_list.data;
  
  return [message_neigh_list, message_topics_list]
}

const listenerMethods = {
  getInitData: getInitData
}

export default listenerMethods