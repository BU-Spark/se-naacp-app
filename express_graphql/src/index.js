const express = require("express")
const { graphqlHTTP } = require("express-graphql")

// Import GraphQL Schemas
const { masterSchema, masterResolver } = require("./services/master_service.js");

var app = express()
app.use(
  "/universalValues",
  graphqlHTTP({
    schema: masterSchema,
    rootValue: masterResolver,
    graphiql: true,
  })
)
app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/universalValues")