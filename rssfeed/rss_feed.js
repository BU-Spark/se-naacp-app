const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs").promises; // Import the promise version of fs
const fs1 = require("fs"); // Regular fs for createReadStream

const path = require("path");
const papa = require("papaparse");
const crypto = require("crypto");
const sha256 = require("js-sha256");

const { MongoClient } = require("mongodb");
const { Callbacks } = require("jquery");

// connect to railway mongoDB
const mongoUrl = "mongodb://mongo:UTwpvdTfzaWxGt29evbw@containers-us-west-177.railway.app:6703"; // GraphQL_DB
const dbName = "se_naacp_db";
const client = new MongoClient(mongoUrl);

// set up cors proxy for POST csv to api
const corsProxy = "https://corsproxy.io/?";
const url = "https://dummy-server-toswle5frq-uc.a.run.app/upload_csv";
// const proxy_Url = corsProxy + url;
const proxy_Url = "https://ml-service-toswle5frq-ue.a.run.app/upload_csv";

// Scrapping Functions

// Gets all the links (or documents) from MongoDB RSS_Link Collection
const get_links = async () => {
  let db = client.db(dbName);
  const rss_links = db.collection("rss_links");
  const documents = await rss_links.find({}).toArray();
  return documents;
};

const scrap_data_to_db = (client, url) => {
  let titles = [];
  let links = [];
  let descriptions = [];
  let contents = [];
  let pubDates = [];

  if (!url) {
    return;
  }

  axios
    .get(url)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    })
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      // Scrapping
      $("item").each(function () {
        titles.push($("title", this).text());
        links.push($("guid", this).text());
        descriptions.push($("description", this).text());
        pubDates.push($("pubDate", this).text());
        contents.push($("content\\:encoded", this).text());
      });

      const rss_data = client.db(dbName).collection("rss_data");

      // Hashing
      const ids = contents.map((content) => {
        return crypto.createHash("sha256").update(content).digest("hex");
      });

      let arr = titles.map((title, index) => {
        return {
          userId: "1",
          rssLink: "https://www.wgbh.org/tags/bunp.rss",
          id: ids[index],
          title: title,
          link: links[index],
          description: descriptions[index],
          pubDates: pubDates[index],
          contents: contents[index],
        };
      });

      // Check if incoming duplicates and only take in non-duplicates.
      rss_data
        .find({ id: { $in: ids } })
        .toArray()
        .then((existingDocs) => {
          // duplicate ones
          const existingIds = new Set(existingDocs.map((doc) => doc.id));
          // new ones after remove duplicates
          const newDocs = arr.filter((doc) => !existingIds.has(doc.id));

          if (newDocs.length > 0) {
            return rss_data.insertMany(newDocs);
          } else {
            console.log("No new items to add.");
            return Promise.resolve();
          }
        })
        .catch((error) => {
          console.error("Error Inserting in MongoDB:", error);
        })
        .finally(() => {
          client.close();
        });
    });

  return;
};


// *** Other *** //
// This function removes duplicates from existing database. We can save it for future
const removeDuplicates = async () => {
  await client.connect();
  let db = client.db(dbName);
  const rss_data = db.collection("rss_data");

  const duplicates = await rss_data
    .aggregate([
      {
        // Group documents by the 'id' field
        $group: {
          _id: "$id",
          ids: { $addToSet: "$_id" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ])
    .toArray();

  for (let group of duplicates) {
    group.ids.shift(); // remove the first element from duplicates -> the one we save in db.
    await rss_data.deleteMany({ _id: { $in: group.ids } });
  }
};

function convertDateFormat(dateString) {
  // Parse the original date string
  const date = new Date(dateString);

  // Array of day and month names
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

  // Extracting components from the date
  const dayName = days[date.getUTCDay()];
  const day = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  // Constructing the new format
  return `${dayName} ${month} ${day < 10 ? "0" + day : day} ${
    hours < 10 ? "0" + hours : hours
  }:${minutes < 10 ? "0" + minutes : minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  } EST ${year}`;
}

const scrap_data_to_csv = async (client) => {
  const url = await get_links();
  if (url) {
    await Promise.all(
      url.map(async (singleUrls) => {
        console.log(singleUrls);
        let type = [];
        let label = [];
        let headline = [];
        let byline = [];
        let section = [];
        let tagging = [];
        let paths = [];
        let publishDate = [];
        let body = [];

        try {
          const response = await axios.get(singleUrls["url"]);
          const html = response.data;
          const $ = cheerio.load(html);

          $("item").each(function () {
            headline.push($("title", this).text());
            byline.push("GBH News");
            section.push("Politics");
            tagging.push(sha256($("content\\:encoded", this).text()));
            paths.push($("guid", this).text());
            publishDate.push(convertDateFormat($("pubDate", this).text()));
            body.push($("content\\:encoded", this).text());
            type.push("Article");
            label.push($("title", this).text());

            // descriptions.push($("description", this).text());
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }

        const myHeadline = headline.map((headline) => [headline]);
        const myByline = byline.map((byline) => [byline]);
        const mySection = section.map((section) => [section]);
        const myTagging = tagging.map((tagging) => [tagging]);
        const myPaths = paths.map((paths) => [paths]);
        const myPublishDate = publishDate.map((publishDate) => [publishDate]);
        const myBody = body.map((body) => [body]);
        const myType = type.map((type) => [type]);
        const mylabel = label.map((label) => [label]);

        // zip arrays together into a big array
        const myarr = myHeadline.map((title, index) => [
          myHeadline,
          myByline[index],
          mySection[index],
          myTagging[index],
          myPaths[index],
          myPublishDate[index],
          myBody[index],
          myType[index],
          mylabel[index],
        ]);

        // add headers
        const headers = [
          "Headline",
          "Byline",
          "Section",
          "Tagging",
          "Paths",
          "Publish Date",
          "Body",
          "Type",
          "Label",
        ];
        const arr = [headers, ...myarr];
        const csv = papa.unparse(arr, {
          quotes: true,
          delimiter: ",",
        });

        const csvBlob = new Blob([csv], { type: "text/csv" });

        const formData = new FormData();
        formData.append("file", csvBlob, "filename.csv");
        formData.append("user_id", singleUrls["userID"]);

        // axios
        //   .post(proxy_Url, formData, {
        //     headers: {
        //       "Content-Type": "multipart/form-data",
        //     },
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   })
        //   .then((response) => {
        //     console.log(response);
        //   });

        callback(null, res);
      })
    );
  }

  return "success";
};

// const main = () => {
//   // Instaniate MongoDB
//   //   client.connect().then((client) => {
//   //     get_links(client)
//   //       .catch((err) => console.log(`Fetching Links Error: ${err}`))
//   //       .then((documents) => {
//   //         for (let i = 0; i < documents.length; i++) {
//   //           scrap_data_to_db(client, documents[i].url);
//   //         }
//   //       });
//   //   });



console.log(scrap_data_to_csv());

// };

// main();
