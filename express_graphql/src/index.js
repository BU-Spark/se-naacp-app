const express = require("express")
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql")

// Import GraphQL Schemas and Resolvers
const { masterSchema, masterResolver } = require("./services/master_service.js");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(
  "/universalValues",
  graphqlHTTP({
    schema: masterSchema,
    rootValue: masterResolver,
    graphiql: true,
  })
);


app.listen(PORT)
console.log(`Running a GraphQL API server at http://localhost:${PORT}`)