const express = require("express")
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql")

// Main Schemas
const { rootSchema, rootResolver } = require("./schemas/rootSchema.js");

// Import GraphQL Schemas and Resolvers
const { masterSchema, masterResolver } = require("./services/master_service.js");
const { querySchema, queryResolver } = require("./services/query_service.js");

const app = express();
const PORT = process.env.PORT;
// const PORT = 4000; Development

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

// Make sure that root path is always last in the graphQL API's
app.use(
  "/",
  graphqlHTTP({
    schema: rootSchema,
    rootValue: rootResolver,
    graphiql: true
  })
);

app.listen(PORT)
console.log(`Running a GraphQL API server at http://<deployment-domain>:${PORT}`)