const Knex = require('knex')
const path = require('path')
const config = require('../../config')
const { logger } = require('../../lib/logger')

const knex = Knex({
  client: 'pg',
  connection: {
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    ssl: true,
  },
  migrations: {
    directory: path.join(__dirname, '../../db/migrations'),
  },
  seeds: {
    directory: path.join(__dirname, '../../db/seeds'),
  },
  useNullAsDefault: true,
  // set our connection pool to PG
  pool: {
    min: 2,
    // TODO: Increase the number of connections if needed (possibly)
    // max number of sql connections is limited by heroku so we just set it
    // to a small number 10. The more connections to PG the better since
    // more queries can happen at once, especially for a project like this
    max: config.db.max_connections,
    afterCreate(conn, done) {
      conn.on('error', error => {
        error.message2 = 'mysql connection error'
        logger.error(error)
      })
      conn.query('SELECT version();', error => {
        if (error) {
          error.message2 = 'mysql initial select error'
          logger.error(error)
          done(error, conn)
        } else {
          logger.info(`postgres connection established successfully`)
          done(undefined, conn)
        }
      })
    },
  },
})

module.exports = knex
