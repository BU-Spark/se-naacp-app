// Master Service: Queries master lists of the application such as 
// all neighborhoods, Tracts, and Topics

// All API"'s with List references master

// getNeighborhoods()
// PARAMETERS:
// ------------------------
// db: Firebase Firestore instance
//
// RETURNS:
// ------------------------
// --> ( A list of neighborhoods & all the associated tracts for each neighborhood)
async function getNeighborhoods(db) {
    let sn_list = [];

    const neighborhoodRef = db.collection('neighborhood_meta');
    const sn_response = await neighborhoodRef.get();
    sn_response.forEach( (doc) => {
      sn_list.push({neighborhood: doc.id, tracts: doc.data().tracts});
    });

    return sn_list;
};

// getTopics()
// PARAMETERS:
// ------------------------
// db: Firebase Firestore instance
//
// RETURNS:
// ------------------------
// --> (A list of known Topics)
async function getTopics(db) {
    let topics_list = [];
  
    const topicsRef = db.collection('topics_meta');
    const topics_response = await topicsRef.get();
    topics_response.forEach( (doc) => {
        topics_list.push(doc.id);
    });

    return topics_list;
};

module.exports = { getNeighborhoods, getTopics }
