const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '.env'),
})

const config = require('./src/config')

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      ssl: true,
    },
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds',
    },
    useNullAsDefault: true,
  },
  test: {
    client: 'pg',
    connection: config.testDb,
    migrations: {
      directory: './src/db/migrations',
    },
    seeds: {
      directory: './src/db/seeds',
    },
    useNullAsDefault: true,
  },
}
