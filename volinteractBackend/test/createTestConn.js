const { Model } = require('objection')
const Knex = require('knex')
const knexfile = require('../knexfile')

const createTestConn = async () => {
  const knex = Knex(knexfile.test)
  Model.knex(knex)
  await knex.migrate.rollback()
  await knex.migrate.latest()
  //await knex.seed.run()
  return knex
}

module.exports = createTestConn
