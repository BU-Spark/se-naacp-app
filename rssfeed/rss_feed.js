const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const papa = require('papaparse');
const crypto = require('crypto');

const { MongoClient } = require('mongodb');

// connect to railway mongoDB
const mongoUrl = "mongodb://mongo:UTwpvdTfzaWxGt29evbw@containers-us-west-177.railway.app:6703"; // GraphQL_DB
const dbName = "se_naacp_db";
const client = new MongoClient(mongoUrl);

 // set up cors proxy for POST csv to api
 const corsProxy = "https://corsproxy.io/?";
 const url = "https://dummy-server-toswle5frq-uc.a.run.app/upload_csv";
 const proxy_Url = corsProxy + url;

 // Scrapping Functions

 // Gets all the links (or documents) from MongoDB RSS_Link Collection
 const get_links = async (client) => {
    let db = client.db(dbName);
    const rss_links = db.collection("rss_links");
    const documents = await rss_links.find({}).toArray();
    return documents;
}

const scrap_data_to_db = (client, url) => {
    let titles = [];
    let links = [];
    let descriptions = [];
    let contents = [];
    let pubDates = [];

    if (!url) {
        return;
    }

    axios.get(url).then(response => {
        return response
    })
    .catch((error) => {
        console.error('Error fetching data:', error)
    }).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        // Scrapping
        $('item').each(function() {
            titles.push($('title', this).text());
            links.push($('guid', this).text());
            descriptions.push($('description', this).text());
            pubDates.push($('pubDate', this).text());
            contents.push($('content\\:encoded', this).text());
        });

        const rss_data = client.db(dbName).collection("rss_data");

        // Hashing
        const ids = contents.map(content => {
            return crypto.createHash('sha256').update(content).digest('hex');
        })
    
        let arr = titles.map((title, index) => {
            return {
                userId: "1",
                rssLink: "https://www.wgbh.org/tags/bunp.rss",
                id: ids[index],
                title: title,
                link: links[index],
                description: descriptions[index],
                pubDates: pubDates[index],
                contents: contents[index]
            }
        });

        // Check if incoming duplicates and only take in non-duplicates.
        rss_data.find({id : {$in: ids} }).toArray().then(existingDocs => {
            // duplicate ones
            const existingIds = new Set(existingDocs.map(doc => doc.id));
            // new ones after remove duplicates
            const newDocs = arr.filter(doc => !existingIds.has(doc.id));
        
            if (newDocs.length > 0) {
                return rss_data.insertMany(newDocs);
            } else {
                console.log("No new items to add.");
                return Promise.resolve();
            }
        })
        .catch((error) => {
            console.error('Error Inserting in MongoDB:', error)
        })
        .finally(() => {
            client.close();
        });
        
    });

    return;
}


// Example usage
const main = () => {
    // Instaniate MongoDB
    client.connect().then((client) => {
        get_links(client)
        .catch(err => console.log(`Fetching Links Error: ${err}`))
        .then((documents) => {
            for (let i = 0; i < documents.length; i++) {
                scrap_data_to_db(client, documents[i].url);
            }
        });
    });
}

main();




// *** Other *** //
// This function removes duplicates from existing database. We can save it for future
const removeDuplicates = async () => {
    await client.connect();
    let db = client.db(dbName);
    const rss_data = db.collection("rss_data");

    const duplicates = await rss_data.aggregate([
        {
            // Group documents by the 'id' field
            $group: {
                _id: "$id", 
                ids: { $addToSet: "$_id" }, 
                count: { $sum: 1 } 
            }
        },
        {
            $match: {
                count: { $gt: 1 } 
            }
        }
    ]).toArray();

    for (let group of duplicates) {
        group.ids.shift(); // remove the first element from duplicates -> the one we save in db.
        await rss_data.deleteMany({ _id: { $in: group.ids } });
    }
}

const scrap_data_to_csv = async () => {
    let titles = [];
    let links = [];
    let descriptions = [];
    let contents = [];
    let pubDates = [];

    const url = await get_link();
    if (url) {
        await axios.get(url).then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('item').each(function() {
                //console.log('>' + $(this).text()+'\n');
                titles.push($('title', this).text());
                links.push($('guid', this).text());
                descriptions.push($('description', this).text());
                pubDates.push($('pubDate', this).text());
                contents.push($('content\\:encoded', this).text());
                // console.log($('content\\:encoded').text());
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error)
        });
    };

    // const csvContent = titles.map((title, index) => `"${title}", "${links[index]}", "${descriptions[index]}", "${contents[index]}", "${pubDates[index]}"`).join('\n');
    
    const mytitle = titles.map(title => [title]);
    const mylink = links.map(link => [link]);
    const mydesc = descriptions.map(desc => [desc]);
    const myDate = pubDates.map(date => [date]);
    const myContent = contents.map(content => [content]);

    // zip arrays together into a big array
    const myarr = mytitle.map((title, index) => [title, mylink[index], mydesc[index], myDate[index], myContent[index]]);

    // add headers
    const headers = ["Title", "Link", "Description", "PubDate", "Content"];
    const arr = [headers, ...myarr];

    // papa unparse input has to be array of arrays, or array of objects.
    const csv = papa.unparse(arr, {
        quotes: true, // Wrap every field in quotes
        delimiter: ",", // Use comma as the delimiter
    });
    // write to csv
    filePath = path.resolve(__dirname, 'new_articles.csv');
    fs.writeFileSync(filePath, csv);

    // send to end point
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    axios
        .post(proxy_Url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.error(error);
        });

    return myarr;
}

//module.exports={scrap_data_to_csv: scrap_data_to_csv, get_link: get_link, scrap_data_to_db: scrap_data_to_db};




