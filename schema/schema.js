const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID
} = require('graphql')

const owners = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Doe",
  },
]

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
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString }
  })
})

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    pet: {
      type: PetType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        console.log(typeof(args.id))
        return pets.find(pet => pet.id === args.id) 
      }
    },
    owner: {
      type: OwnerType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        console.log(typeof(args.id))
        return owners.find(owner => owner.id === args.id) 
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
