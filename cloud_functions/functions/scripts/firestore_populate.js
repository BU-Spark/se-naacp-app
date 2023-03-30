const functions = require("firebase-functions");

// You can delete this req, this is just for debug purposes...
const MASTER_DATA = require('./JSON_data/NAACP_Updated.json');
const ARTICLE_DATA = require('./JSON_data/naacpdata.json')

console.log("The Keys for MASTER_DATA:", Object.keys(MASTER_DATA));
console.log("The Keys for ARTICLE_DATA:", Object.keys(ARTICLE_DATA));

// Populates data into emulator based on the given JSON data in the format listed below.
// First Order Key (Collection)
//     Second Order Key 1 (Document Title Inside Collection)
//          {Other Keys...} (Data) 
//     Second Order Key 2 (Document Title Inside Collection)
//          {Other Keys...} (Data) 
//     Second Order Key 3 (Document Title Inside Collection)
//          {Other Keys...} (Data) 
//     ...
// 
// <-- database: Firebase Database Ref
// <-- MASTER_DATA: JSON Data
// <-- collection_chosen_name: String name of the collection to be named
// <-- firstOrderKey: String Name of Object key to get data from
// --> Returns a resolved void promise
// neighs_filter
//'subneighborhood_meta'
async function populate_first_order_data (database, MASTER_DATA, collection_chosen_name, firstOrderKey) {
    const collections_list = Object.keys(MASTER_DATA);
    const firstOrderKey_list = Object.keys(MASTER_DATA[firstOrderKey]);
    const CollectionRef = database.collection(collection_chosen_name);

    // Check if empty so we don't always fetch everytime on intialization
    const isEmpty = await CollectionRef.get().then( (snapshot) => {
        console.log(snapshot._size);
        if (snapshot._size == 0) {
            return true
        } else {
            return false
        }
    });

    console.log("[firestore_populate.js] Is the collection missing?", isEmpty)

    // Populate Collection
    if (isEmpty) {
        console.log("[firestore_populate.js] Populating Document!");

        // Special case
        if (firstOrderKey === 'dates_filter') {
            try {
                const res = await firstOrderKey_list.forEach( (elem) => {
                    let dateCopy = JSON.parse(JSON.stringify(elem));
                    dateCopy = dateCopy.replaceAll('-', '').replaceAll(' ', '').replaceAll(':', '').substring(0, 8);
                    documentData = Object.assign(MASTER_DATA[firstOrderKey][`${elem}`], { dateSum: parseInt(dateCopy) });
                    database.collection(collection_chosen_name).doc(elem).set(documentData);
                });
            } catch(error) {
                console.log(`[firestore_populate.js] Unable to Populate ${collection_chosen_name} list:`, error);
            }
        } else {
            try {
                const res = await firstOrderKey_list.forEach( (elem) => {
                    // let target_index = collections_list.indexOf(firstOrderKey);
                    database.collection(collection_chosen_name).doc(elem).set(MASTER_DATA[firstOrderKey][`${elem}`]);
                });
            } catch(error) {
                console.log(`[firestore_populate.js] Unable to Populate ${collection_chosen_name} list:`, error);
            }
        }
    }
};

module.exports = { populate_first_order_data }


