const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const papa = require('papaparse');

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
    fs.writeFileSync(path.resolve(__dirname, 'new_articles.csv'), csv);
    return myarr;
}

// Example usage
const main = async () => {
    let url = await get_link();
    let test = await scrap_data(url)
    // console.log("TEST:\n" + test);
}

main();

module.exports={scrap_data: scrap_data, get_link: get_link};




