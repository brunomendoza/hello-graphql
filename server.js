const express = require('express')
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const app = express()

app.use(cors())
// https://expressjs.com/en/guide/using-middleware.html
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))
app.listen(5000, () => console.log('Running GraphQL API server'))
