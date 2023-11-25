const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://www.wgbh.org/tags/bunp.rss').then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    article_count = 0;

    $('item title').each(function() {
        article_count += 1;
        console.log('>' + $(this).text()+'\n');
    });
    console.log(article_count);
})
.catch((error) => {
    console.error('Error fetching data:', error)
});

