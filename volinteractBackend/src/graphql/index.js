const merge = require('lodash.merge')
const typeDefs = require('./typeDefs')
const types = require('./types')

const protoResolvers = [types]
const resolvers = merge(...protoResolvers)

exports.typeDefs = typeDefs
exports.resolvers = resolvers
