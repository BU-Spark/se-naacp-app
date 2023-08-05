const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const multer = require("multer");
const csv = require("csv-parser"); // for parsing CSV
const fs = require("fs");
const url = "mongodb://localhost:27017";
const dbName = "se_naacp_gbh";
const { MongoClient } = require("mongodb");


const Parser = require('rss-parser'); // import rss-parser
let parser = new Parser();

const client = new MongoClient(url);

// Main Schemas
const { rootSchema, rootResolver } = require("./schemas/rootSchema.js");

// Import GraphQL Schemas and Resolvers
const {
  masterSchema,
  masterResolver,
} = require("./services/master_service.js");

const { querySchema, queryResolver } = require("./services/query_service.js");

const app = express();
// const PORT = process.env.PORT;
const PORT = 4000; //Development

app.use(cors()); // Cors Policy

app.use(express.json()); // <-- Add this line here

// Handle file upload
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      // You can do your processing here.
      // For this example, we're simply returning the parsed CSV data.
      res.json(results);
    });
});

app.post("/uploadRSS", async (req, res) => {
  try {
    const { rssLink } = req.body;
    console.log(rssLink); // Print the received link

    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection("rss_links");

    // Try to parse the RSS feed
    let feed;
    try {
      feed = await parser.parseURL(rssLink);
    } catch (err) {
      console.log("Link is not an RSS feed link");
      return res.status(200).json({ message: 'Invalid RSS Link' });
    }

    if (feed) {
      // The URL is a valid RSS feed, insert it into the MongoDB collection
      // insert or ignore if the link already exists
      const updateResponse = await collection.findOneAndUpdate(
        { link: rssLink }, 
        { $setOnInsert: { link: rssLink } }, 
        { upsert: true, returnDocument: 'after' } 
      );
      console.log(updateResponse.lastErrorObject.updatedExisting);
      if (updateResponse.lastErrorObject.updatedExisting) {
        res.status(200).json({ message: 'RSS Link already exists' });
      } else {
        res.status(200).json({ message: 'RSS Link saved successfully' });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Unexpected server error' });
  } finally {
    // close the database connection
    await client.close();
  }
});


app.use(
  "/universalValues",
  graphqlHTTP({
    schema: masterSchema,
    rootValue: masterResolver,
    graphiql: true,
  })
);

app.use(
  "/queryValues",
  graphqlHTTP({
    schema: querySchema,
    rootValue: queryResolver,
    graphiql: true,
  })
);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: rootSchema,
    rootValue: rootResolver,
    graphiql: true,
  })
);

app.listen(PORT, () =>
  console.log(
    `Running a GraphQL API server at http://<deployment-domain>:${PORT}`
  )
);
