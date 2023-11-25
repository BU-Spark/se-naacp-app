const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.wgbh.org/tags/bunp.rss';

const scrap_data = async (url) => {
    let titles = [];

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

    return titles;
}


// Example usage
const main = async () => {
    let test = await scrap_data(url)
    console.log("TEST:\n" + test);
}

// main();

module.exports={scrap_data: scrap_data};




