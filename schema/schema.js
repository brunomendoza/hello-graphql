const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema
} = require('graphql')

const pets = [
  {
    id: "1",
    name: "Tobby",
    genre: "male"
  },
  {
    id: "2",
    name: "Jane",
    genre: "female"
  },
  {
    id: "2",
    name: "Hercules",
    genre: "male"
  },
]

const PetType = new GraphQLObjectType({
  name: 'Pet',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    pet: {
      type: PetType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return pets.find(pet => pet.id === args.id) 
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
