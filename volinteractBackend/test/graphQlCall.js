const { graphql } = require('graphql')
const { makeExecutableSchema } = require('graphql-tools')

const typeDefs = require('../src/graphql/typeDefs')
// const User = require('../src/models/User')*/
const resolvers = require('../src/graphql/types')

const schema = makeExecutableSchema({ typeDefs, resolvers })

const graphqlCall = async (query, variables, userId) => {
  /* if (userId) {
    const user = await User.query().findById(userId)
    return graphql(
      schema,
      query,
      undefined,
      {
        user,
      },
      variables,
    )
  } */
  return graphql(schema, query, undefined, {}, variables)
}

module.exports = graphqlCall
