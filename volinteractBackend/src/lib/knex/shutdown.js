const knex = require('./index')
const { logger } = require('../../lib/logger')

async function shutdownKnex() {
  try {
    logger.info('Knex: Shutting down')
    await knex.destroy()
    logger.info('Knex: Shutdown complete')
  } catch (error) {
    error.message2 = 'Knex: Shutdown error'
    logger.error(error)
  }
}

exports.shutdownKnex = shutdownKnex
