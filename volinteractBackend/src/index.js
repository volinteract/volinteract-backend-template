const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '../.env'),
})

const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const hpp = require('hpp')
const morgan = require('morgan')
const config = require('./config')
const graphqlRouter = require('./graphql/router')
const knexInitialize = require('./lib/knex/initialize')
const { initializeAppCleanup, shutdown } = require('./cleanup')
const { initializeSentry } = require('./lib/sentry')
const { logger, loggerNoSentry, stream: loggerStream } = require('./lib/logger')

const app = express()
const server = http.createServer(app)

const corsConfig = {
  origin: true,
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 200,
}

let httpServerListening = false

function uncaughtErrorLogger(error, _req, res, next) {
  try {
    logger.error(error)
    // note that the setError property will automatically print errors
    res.status(500)
    return res.json({
      message: 'An error occurred on the api level',
    })
  } catch (newError) {
    return next(newError)
  }
}

async function startApp() {
  // initialize functions to allow graceful shutdown of server
  await initializeAppCleanup()
  await initializeSentry()

  // db migrations
  await knexInitialize.runMigrations()

  // cors
  app.use(cors(corsConfig))
  app.options('*', cors(corsConfig))

  app.set('etag', 'weak')
  app.set('trust proxy', true)

  // security
  app.use(helmet.xssFilter())
  app.use(helmet.frameguard({ action: 'sameorigin' }))
  app.use(helmet.hidePoweredBy())
  app.use(helmet.ieNoOpen())

  // log requests
  app.use(
    morgan(
      process.env.NODE_ENV === 'development' ? 'dev' : 'combined',
      loggerStream,
    ),
  )

  // parse requests
  app.use(
    bodyParser.urlencoded({
      extended: false,
      limit: '1mb',
    }),
  )
  app.use(
    bodyParser.json({
      limit: '1mb',
    }),
  )

  // prevent parameter pollution (required after body is parsed)
  app.use(hpp())

  // default headers
  app.use((req, res, next) => {
    const token = req.headers['x-access-token']
    if (!token || token.length < 20) {
      req.headers['x-access-token'] = undefined
      logger.warn(`got invalid token, setting it to undefined`)
    }
    res.set('cache-control', 'no-cache')
    next()
  })

  // default request properties
  app.use((req, _res, next) => {
    req.user = null
    next()
  })

  // graphql
  await graphqlRouter.initializeGraphqlRouter(app)

  app.all('*', (_req, res) => {
    res.status(404)
    res.json({
      message: 'content not found',
    })
  })
  app.use(uncaughtErrorLogger)
  // eslint-disable-next-line no-unused-vars
  app.use((error, _req, res, _next) => {
    logger.error(error, 'error caught on last error handling middleware')
    res.status(500).json({
      error:
        'An error occurred that could not be handled. Please try again later.',
    })
  })

  server.listen(config.port, () => {
    httpServerListening = true
    logger.info(`Server listening, port=${config.port}`)
  })
}

// function to shutdown server gracefully
const shutdownServer = async () => {
  if (!httpServerListening) {
    return
  }
  try {
    logger.info('Server: Shutting down')
    await new Promise((resolve, reject) => {
      server.close(error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
    httpServerListening = false
    logger.info('Server: Shutdown complete')
  } catch (error) {
    error.message2 = 'Server: Shutdown error'
    logger.error(error)
  }
}

// only start if app is run directly
if (require.main === module) {
  Promise.resolve()
    .then(() => logger.info('starting app...'))
    .then(startApp)
    .then(() => logger.info('app started successfully!'))
    .catch(error => {
      error.message2 = 'fatal runtime error'
      loggerNoSentry.error(error)
      return shutdown(1)
    })
}

exports.app = app
exports.shutdownServer = shutdownServer
