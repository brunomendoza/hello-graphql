const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')

const app = express()
// https://expressjs.com/en/guide/using-middleware.html
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))
app.listen(5000, () => console.log('Running a GraphQL API server'))
