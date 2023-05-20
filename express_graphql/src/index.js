const express = require("express")
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql")

// Import GraphQL Schemas and Resolvers
const { masterSchema, masterResolver } = require("./services/master_service.js");
const { querySchema, queryResolver } = require("./services/query_service.js");

const app = express();
const PORT = 4000;

app.use(cors()); // Cors Policy

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


app.listen(PORT)
console.log(`Running a GraphQL API server at http://localhost:${PORT}`)