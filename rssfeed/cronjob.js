const rss = require('./rss_feed.js');
const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');

cron.schedule('* * * * *', async () => {
  console.log('running a task every minute');
  const url = 'https://www.wgbh.org/tags/bunp.rss';
  console.log(await rss.scrap_data(url));
});