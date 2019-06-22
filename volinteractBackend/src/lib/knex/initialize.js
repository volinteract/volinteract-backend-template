const knex = require('./index')

function runMigrations() {
  return knex.migrate.latest()
}

exports.runMigrations = runMigrations
