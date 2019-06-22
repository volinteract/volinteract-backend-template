const merge = require('lodash.merge')
const query = require('./Query')
const mutation = require('./Mutation')

const resolvers = [query, mutation]

module.exports = merge(...resolvers)
