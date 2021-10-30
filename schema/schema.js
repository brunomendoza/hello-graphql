const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList
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
    genre: "male",
    ownerId: "1"
  },
  {
    id: "2",
    name: "Jane",
    genre: "female",
    ownerId: "2"
  },
  {
    id: "2",
    name: "Hercules",
    genre: "male",
    ownerId: "1"
  },
]

const PetType = new GraphQLObjectType({
  name: 'Pet',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    owner: {
      type: OwnerType,
      resolve(parent, args) {
        return owners.find(owner => owner.id === parent.ownerId)
      }
    }
  })
})

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    pets: {
      type: new GraphQLList(PetType),
      resolve(parent, args) {
        return pets.filter(pet => pet.ownerId === parent.id)
      }
    }
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
    },
    owners: {
      type: GraphQLList(OwnerType),
      args: {},
      resolve(parent, args) {
        console.log(typeof(args.id))
        return owners 
      }
    },
    pets: {
      type: GraphQLList(PetType),
      args: {},
      resolve(parent, args) {
        return pets
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery
})
