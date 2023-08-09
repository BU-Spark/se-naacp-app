const { MongoClient } = require('mongodb');
const MASTER_DATA = require('./JSON_data/non_stochastic_model_output.json');

// For Debug purposes
// const keys_list = Object.keys(MASTER_DATA);
// console.log("The Keys for MASTER_DATA:", keys_list);
// console.log("Articles count:", Object.values(MASTER_DATA[keys_list[0]]).length)
// console.log("Topics count:", Object.values(MASTER_DATA[keys_list[1]]).length)
// console.log("Dates count:", Object.values(MASTER_DATA[keys_list[2]]).length)
// console.log("Neighborhood count:", Object.values(MASTER_DATA[keys_list[3]]).length)
// console.log("Tracts count:", Object.values(MASTER_DATA[keys_list[4]]).length)

const url = 'mongodb://localhost:27017'; // Will be automated...
const dbName = 'se_naacp_gbh'; // Will be automated...
const client = new MongoClient(url);

// Mongo Main Driver
async function main() {
    await client.connect();
    console.log('MongoDB Successfully connected');
    const db = client.db(dbName);

    await populate_first_order_data(db, MASTER_DATA, "articles_data", Object.keys(MASTER_DATA)[0], false)
    await populate_first_order_data(db, MASTER_DATA, "topics_data", Object.keys(MASTER_DATA)[1], false)
    await populate_first_order_data(db, MASTER_DATA, "dates_data", Object.keys(MASTER_DATA)[2], false)
    await populate_first_order_data(db, MASTER_DATA, "neighborhood_data", Object.keys(MASTER_DATA)[3], false)
    await populate_first_order_data(db, MASTER_DATA, "tracts_data", Object.keys(MASTER_DATA)[4], false)
  
    return 'Operation Complete.';
}


main().then(console.log).catch(console.error).finally(() => client.close());

// Populates data into MongoDB based on the given JSON data in the format listed below.
// First Order Key (Collection)
//     Second Order Key 1 (Document Title Inside Collection)
//          {Other Keys...} (Data) 
//     Second Order Key 2 (Document Title Inside Collection)
//          {Other Keys...} (Data) 
//     Second Order Key 3 (Document Title Inside Collection)
//          {Other Keys...} (Data) 
//     ...
// 
// <-- database: Mongo Database Ref
// <-- MASTER_DATA: JSON Data
// <-- collection_chosen_name: String name of the collection to be named
// <-- firstOrderKey: String Name of Object key to get data from
// --> Returns a resolved void promise
// neighs_filter
//'subneighborhood_meta'
async function populate_first_order_data (database, MASTER_DATA, collection_chosen_name, firstOrderKey, verbose) {
    const collection = database.collection(`${collection_chosen_name}`);
    documentsList = Object.values(MASTER_DATA[firstOrderKey]);
    
    // Special case for dates
    if (firstOrderKey === 'dates_filter') {
        let date_documents = [];
        for (let i = 0; i < documentsList.length; i++) {
            elem = documentsList[i];
            let raw_date = elem.value;
            let dateCopy = raw_date.replaceAll('-', '').replaceAll(' ', '').replaceAll(':', '').substring(0, 8);
            elem = Object.assign(elem, { dateSum: parseInt(dateCopy) });
            date_documents.push(elem);
        }
        const insertResult = await collection.insertMany(date_documents);
        if (verbose){
            console.log('Inserted documents =>', insertResult);
        }
    } else {
        const insertResult = await collection.insertMany(documentsList);
        if (verbose){
            console.log('Inserted documents =>', insertResult);
        }
    }
    
    return;
};


