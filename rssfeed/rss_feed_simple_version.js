const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

const papa = require("papaparse");
const sha256 = require("js-sha256");
require('dotenv').config(); 


const { MongoClient } = require("mongodb");

const mongoUrl = process.env.NAACP_MONGODB;
const proxy_Url = process.env.PROXY_URL;
const dbName = process.env.DB_NAME;
const x_api_key = process.env.X_API_KEY;

async function get_links() {
  const client = new MongoClient(mongoUrl);

  try {
    await client.connect();

    const db = client.db(dbName);

    const collection = db.collection("rss_links");

    const documents = await collection.find({}).toArray();
    return documents;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    await client.close();
  }
}

const convertDateFormat = (dateString) => {
  const date = new Date(dateString);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getUTCDay()];
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return `${dayName} ${month} ${day < 10 ? "0" + day : day} ${
    hours < 10 ? "0" + hours : hours
  }:${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  } EST ${year}`;
};

const scrap_data_to_csv = async (url) => {
  let headline = [];
  let publisher = [];
  let byline = [];
  let paths = [];
  let publishDate = [];
  let body = [];

  try {
    const response = await axios.get(url["url"]);
    const html = response.data;
    const $ = cheerio.load(html);

    $("item").each(function () {
      headline.push($("title", this).text());
      byline.push("GBH News");
      publisher.push("GBH News");
      paths.push($("guid", this).text());
      publishDate.push(convertDateFormat($("pubDate", this).text()));
      body.push($("content\\:encoded", this).text());
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const myHeadline = headline.map((headline) => [headline]);
  const myPublisher = publisher.map((publisher) => [publisher]);
  const myByline = byline.map((byline) => [byline]);
  const myPaths = paths.map((paths) => [paths]);
  const myPublishDate = publishDate.map((publishDate) => [publishDate]);
  const myBody = body.map((body) => [body]);

  const myarr = myHeadline.map((myHeadline, index) => [
    myHeadline,
    myPublisher[index],
    myByline[index],
    myPaths[index],
    myPublishDate[index],
    myBody[index],
  ]);

  const headers = [
    "Headline",
    "Publisher",
    "Byline",
    "Paths",
    "Publish Date",
    "Body",
  ];
  const arr = [headers, ...myarr];
  const csv = papa.unparse(arr, {
    quotes: true,
    delimiter: ",",
  });

  const csvBlob = new Blob([csv], { type: "text/csv" });

  const formData = new FormData();
  formData.append("file", csvBlob, "filename.csv");
  formData.append("user_id", url["userID"]);

  axios
    .post(proxy_Url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "X-API-KEY": x_api_key,
      },
    })
    .catch((error) => {
      console.log(error);
    })
    .then((response) => {
      console.log(response.status);
    });

  return "success";
};

const main = async () => {
  try {
    const documents = await get_links();
    for (const links of documents) {
      await scrap_data_to_csv(links);
    }
  } catch (error) {
    console.error("Failed in main:", error);
  }
};

function logMessage() {
  console.log("Cron job executed at:", new Date().toLocaleString());
}

cron.schedule("0 8 * * *", async () => {
  logMessage();
  await main();
});
