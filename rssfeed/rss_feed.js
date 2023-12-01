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

const get_link = async () => {
    try {
        await client.connect();
        let db = client.db(dbName);
        const rss_links = db.collection("rss_links");
        // need to change findOne in the future 
        const rssLink = await rss_links.findOne({url: "https://www.wgbh.org/tags/bunp.rss"});
        return rssLink.url;
    } finally {
        await client.close();
    }
}

// const url = 'https://www.wgbh.org/tags/bunp.rss';

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

const scrap_data_to_db = async (url) => {
    // how to plug in user id ?
    // const { user } = useContext(Auth0Context)!;

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

    // const myarr = titles.map((title, index) => [title, links[index], descriptions[index], pubDates[index], contents[index]]);
    // console.log(myarr)

    const ids = titles.map(title => {
        return crypto.createHash('sha256').update(title).digest('hex');
    })

    let arr = titles.map((title, index) => {
        return {
            userId: "1",
            id: ids[index],
            title: title,
            link: links[index],
            description: descriptions[index],
            pubDates: pubDates[index],
            contents: contents[index]
        }
    });
    
    // connect to db
    await client.connect();
    let db = client.db(dbName);
    const rss_data = db.collection("rss_data");

    rss_data.insertMany(arr);

    return arr;
}

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


// Example usage
const lol = async () => {
    let url = await get_link();
    // let test = await scrap_data_to_csv(url)
    await scrap_data_to_db(url);
    await removeDuplicates();
    // console.log("TEST:\n" + test);
}

lol();

module.exports={scrap_data_to_csv: scrap_data_to_csv, get_link: get_link, scrap_data_to_db: scrap_data_to_db};




