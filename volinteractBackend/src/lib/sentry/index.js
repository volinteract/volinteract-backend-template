const Sentry = require('@sentry/node')
const packageJSON = require('../../../package')
const config = require('../../config')
const { shutdown } = require('../../cleanup')

function initializeSentry() {
  Sentry.init({
    dsn: config.sentry.dsn,
    release: packageJSON.version,
    environment: process.env.NODE_ENV,
    sampleRate: 1,
    attachStacktrace: true,
    onFatalError: async error => {
      const { logger } = require('../logger')
      try {
        error.message2 = 'sentry: fatal global error'
        logger.error(error)
        await shutdown(1)
      } catch (shutdownError) {
        console.error(shutdownError)
        process.exit(1)
      }
    },
  })
}

exports.initializeSentry = initializeSentry
