const rss = require('./rss_feed.js');
const cron = require('node-cron');
const axios = require('axios');
const cheerio = require('cheerio');

cron.schedule('20 * * * * *', async () => {
  console.log('running a task every 20 sec');
  // const url = 'https://www.wgbh.org/tags/bunp.rss';
  console.log(await rss.scrap_data(rss.get_link()));
});