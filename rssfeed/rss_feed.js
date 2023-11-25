const axios = require('axios');
const cheerio = require('cheerio');
const { MongoClient } = require('mongodb');

const mongoUrl = "mongodb://localhost:27017"; // Local development
const dbName = "se_naacp_gbh";
const client = new MongoClient(mongoUrl);

const get_link = async () => {
    try {
        await client.connect();
        let db = client.db(dbName);
        const rss_data = db.collection("rss_data");
        // need to change findOne in the future 
        const rssLink = await rss_data.findOne({url: "https://www.wgbh.org/tags/bunp.rss"});
        return rssLink.url;
    } finally {
        await client.close();
    }
}

// const url = 'https://www.wgbh.org/tags/bunp.rss';

const scrap_data = async () => {
    let titles = [];
    const url = await get_link();
    if (url) {
        await axios.get(url).then(response => {
            const html = response.data;
            const $ = cheerio.load(html);

            $('item title').each(function() {
                //console.log('>' + $(this).text()+'\n');
                titles.push($(this).text());
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error)
        });
    };
    return titles;
}


// Example usage
const main = async () => {
    let url = await get_link();
    let test = await scrap_data(url)
    console.log("TEST:\n" + test);
}

// main();

module.exports={scrap_data: scrap_data, get_link: get_link};




