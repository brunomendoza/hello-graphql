const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList
} = require('graphql')

const nano = require('nano')('http://admin:admin@db:5984')

const PetType = new GraphQLObjectType({
  name: 'Pet',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    owner: {
      type: OwnerType,
      resolve (parent, args) {
        // return owners.find(owner => owner.id === parent.ownerId)
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
      resolve (parent, args) {
        // return pets.filter(pet => pet.ownerId === parent.id)
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
      resolve (parent, args) {
        console.log(typeof (args.id))
        // return pets.find(pet => pet.id === args.id)
      }
    },
    owner: {
      type: OwnerType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        console.log(typeof (args.id))
        // return owners.find(owner => owner.id === args.id)
      }
    },
    owners: {
      type: GraphQLList(OwnerType),
      args: {},
      resolve (parent, args) {
        console.log(typeof (args.id))
        // return owners
      }
    },
    pets: {
      type: GraphQLList(PetType),
      args: {},
      resolve (parent, args) {
        // return pets
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addPet: {
      type: PetType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString }
      },
      resolve (parent, args) {
        const pet = nano.use('pet')

        pet.insert({ name: args.name, genre: args.genre })
          .then(response => console.log(response))
          .catch(err => console.error(err))
      }
    },
    addOwner: {
      type: OwnerType,
      args: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString }
      },
      resolve (parent, args) {
        const owner = nano.use('owner')

        owner.insert({ firstName: args.firstName, lastName: args.lastName })
          .then(response => console.log(response))
          .catch(err => console.log(err))
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
