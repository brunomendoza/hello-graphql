const express = require("express")
const { graphqlHTTP } = require("express-graphql") 
const schema = require('./schema/schema')

const nano = require('nano')('http://admin:admin@db:5984')

nano.db.get('graphql')
  .then(data => console.log(data))
  .catch(err => console.err(err))

const app = express()
// https://expressjs.com/en/guide/using-middleware.html
app.use("/graphql", graphqlHTTP({
  schema,
  graphiql: true
}))
app.listen(5000, () => console.log('Running a GraphQL API server at http://localhost:5000/graphql'))