const { shutdownKnex } = require('./lib/knex/shutdown')
const { logger } = require('./lib/logger')

let closeServicesRequested = false
let shutdownRequested = false

const closeServices = async () => {
  if (closeServicesRequested) {
    return
  }
  closeServicesRequested = true
  await require('./index').shutdownServer()
  await shutdownKnex()
}

const shutdown = async exitCode => {
  if (shutdownRequested) {
    process.exit(exitCode)
  }
  shutdownRequested = true
  await closeServices()
  process.exit(exitCode)
}

function initializeAppCleanup() {
  process.on('warning', async warning => {
    logger.warn(warning)
  })

  process.once('SIGTERM', async () => {
    logger.info('SIGTERM')
    await shutdown(0)
  })

  process.once('SIGINT', async () => {
    logger.info('SIGINT')
    await shutdown(0)
  })

  process.once('SIGUSR2', async () => {
    logger.info('SIGUSR2')
    await closeServices()
    process.kill(process.pid, 'SIGUSR2')
  })

  process.once('uncaughtException', async e => {
    logger.error('uncaughtException', e)
    await shutdown(1)
  })

  process.once('unhandledRejection', async reason => {
    logger.error('unhandledRejection', reason)
    await shutdown(1)
  })
}

exports.closeServices = closeServices
exports.shutdown = shutdown
exports.initializeAppCleanup = initializeAppCleanup
