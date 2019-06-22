const { ApolloServer } = require('apollo-server-express')
const { typeDefs, resolvers } = require('./index')

async function initializeGraphqlRouter(app) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      token: req.headers.authorization || null,
    }),
    formatError(error) {
      // error objects may have stack traces or other info that we probably
      // do not want to send back to the user. So here, we just return the
      // error message
      return {
        locations: error.locations,
        path: error.path,
        message:
          error && error.message ? error.message : 'An unknown error occurred.',
      }
    },
    introspection: process.env.NODE_ENV === 'development',
    playground: process.env.NODE_ENV === 'development',
    tracing: process.env.NODE_ENV === 'production',
    cacheControl: true,
    engine: false,
  })
  server.applyMiddleware({
    app,
    path: '/graphql',
  })
}

exports.initializeGraphqlRouter = initializeGraphqlRouter
