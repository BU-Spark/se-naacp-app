const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const multer = require('multer');
const csv = require('csv-parser'); // for parsing CSV
const fs = require('fs');

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

// Handle file upload
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // You can do your processing here. 
      // For this example, we're simply returning the parsed CSV data.
      res.json(results);
    });
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


