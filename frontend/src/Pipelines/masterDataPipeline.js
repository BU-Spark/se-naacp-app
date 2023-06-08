import axios from 'axios';

const getInitData = async() => {
  let message_neigh_list = await axios({
    method: 'POST',
    url: 'http://localhost:4000/universalValues',
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ query: "{ getNeighborhoodList }" })
  }).then(res => {
    console.log(res)
    return res;
  });

  let message_topics_list = await axios({
    method: 'POST',
    url: 'http://localhost:4000/universalValues',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    data: JSON.stringify({ query: 
    "{ getTopicList }"
  })
  }).then(res => {
    console.log(res)
    return res;
  });

  let  message_neigh_list_save = message_neigh_list
  let message_topics_list_save = message_topics_list
  message_neigh_list = JSON.parse(message_neigh_list.data.data.getNeighborhoodList);
  message_topics_list = message_topics_list.data.data.getTopicList;

  return [message_neigh_list, message_topics_list, message_neigh_list_save, message_topics_list_save]
}


// const getInitData = async() => {
//   let message_neigh_list = await axios.get(`https://us-central1-se-naacp-journalism-bias.cloudfunctions.net/getNeighborhoodsList`)
//   .then(res => {
//     return res;
//   });

//   let message_topics_list = await axios.get('https://us-central1-se-naacp-journalism-bias.cloudfunctions.net/getTopicList')
//   .then(res => {
//     return res;
//   });

//   // Set in raw data format
//   message_neigh_list = message_neigh_list.data;
//   message_topics_list = message_topics_list.data;

//   console.log("AISUDHSA:", message_neigh_list)
//   console.log("AISUDHSA:", message_topics_list)
  
//   return [message_neigh_list, message_topics_list]
// }

const listenerMethods = {
  getInitData: getInitData
}

export default listenerMethods