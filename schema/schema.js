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
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    owner: {
      type: OwnerType,
      resolve (parent, args) {
        return nano
          .use('owner')
          .list({ include_docs: true })
          .then(
            res => {
              return res.rows
                .map(row => row.doc)
                .find(doc => doc._id === parent.owner_id)
            }
          )
      }
    }
  })
})

const OwnerType = new GraphQLObjectType({
  name: 'Owner',
  fields: () => ({
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    pets: {
      type: new GraphQLList(PetType),
      resolve (parent, args) {
        return nano
          .use('pet')
          .list({ include_docs: true })
          .then(
            res => {
              return res.rows
                .map(row => row.doc)
                .filter(doc => doc.owner_id === parent._id)
            }
          )
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
        return nano
          .use('pet')
          .get(args.id)
          .then(res => res)
      }
    },
    owner: {
      type: OwnerType,
      args: { id: { type: GraphQLID } },
      resolve (parent, args) {
        return nano
          .use('owner')
          .get(args.id)
          .then(res => res)
      }
    },
    owners: {
      type: GraphQLList(OwnerType),
      args: {},
      resolve (parent, args) {
        return nano
          .use('owner')
          .list()
          .then(res => res)
      }
    },
    pets: {
      type: GraphQLList(PetType),
      args: {},
      resolve (parent, args) {
        return nano
          .use('pet')
          .list({ include_docs: true })
          .then(res => res.rows.map(row => row.doc))
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
        genre: { type: GraphQLString },
        owner_id: { type: GraphQLID }
      },
      resolve (parent, args) {
        return nano
          .use('pet')
          .insert({ name: args.name, genre: args.genre, owner_id: args.owner_id })
          .then(res => ({ _id: res.id }))
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
        return nano
          .use('owner')
          .insert({ firstName: args.firstName, lastName: args.lastName })
          .then(res => ({ _id: res.id }))
          .catch(err => console.log(err))
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
