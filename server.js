const express = require("express")
const { graphqlHTTP } = require("express-graphql") 
const { buildSchema } = require("graphql")

const schema = buildSchema(`
  type Query {
      hello: String
  }
`)

const root = {
  hello: () => {
      return 'Hello world!'
  }
}

const app = express()
// https://expressjs.com/en/guide/using-middleware.html
app.use("/graphql", graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))
app.listen(5000, () => console.log('Running a GraphQL API server at http://localhost:5000/graphql'))