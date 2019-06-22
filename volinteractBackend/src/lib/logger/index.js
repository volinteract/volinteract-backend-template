const { createLogger, format, transports } = require('winston')
const Sentry = require('@sentry/node')
const config = require('../../config')

const { combine, timestamp, printf, prettyPrint } = format

const winstonConfig = {
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warn: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
  colors: {
    emerg: 'red',
    alert: 'red',
    crit: 'red',
    error: 'red',
    warn: 'yellow',
    notice: 'cyan',
    info: 'green',
    debug: 'white',
  },
}

const myFormat = printf(
  info => `${info.timestamp} ${info.level}: ${info.message}`,
)

const simpleLogger = createLogger({
  transports: [
    new transports.Console({
      // @ts-ignore - somehow typescript cannot figure out that these properties
      // are supported
      colors: winstonConfig.colors,
    }),
  ],
  format: combine(timestamp(), myFormat),
  levels: winstonConfig.levels,
  level: config.logLevel,
  exitOnError: false,
})

const objectLogger = createLogger({
  transports: [
    new transports.Console({
      // @ts-ignore - somehow typescript cannot figure out that these properties
      // are supported
      colors: winstonConfig.colors,
    }),
  ],
  format: combine(timestamp(), prettyPrint()),
  levels: winstonConfig.levels,
  level: config.logLevel,
  exitOnError: false,
})

const stream = {
  write(message) {
    if (typeof message === 'string') {
      simpleLogger.info(message)
    } else {
      objectLogger.info(message)
    }
  },
}

const logger = {
  stream: simpleLogger.stream,
  info: (message, prop1, prop2, prop3, prop4, prop5) => {
    if (typeof message === 'string' && !prop1) {
      return simpleLogger.info(message, prop1, prop2, prop3, prop4, prop5)
    }
    if (typeof message === 'object') {
      // remove the long emitter part of the object if available
      if (message.emitter) {
        message.emitter = 'redacted...too long'
      }
      message.prop1 = prop1
      message.prop2 = prop2
      message.prop3 = prop3
      message.prop4 = prop4
      message.prop5 = prop5
      return objectLogger.info(message)
    }
    return objectLogger.info(message, prop1, prop2, prop3, prop4, prop5)
  },
  warn: (message, prop1, prop2, prop3, prop4, prop5) => {
    Sentry.captureMessage(message)
    if (typeof message === 'string' && !prop1) {
      return simpleLogger.warn(message, prop1, prop2, prop3, prop4, prop5)
    }
    if (typeof message === 'object') {
      // remove the long emitter part of the object if available
      if (message.emitter) {
        message.emitter = 'redacted...too long'
      }
      message.prop1 = prop1
      message.prop2 = prop2
      message.prop3 = prop3
      message.prop4 = prop4
      message.prop5 = prop5
      return objectLogger.warn(message)
    }
    return objectLogger.warn(message, prop1, prop2, prop3, prop4, prop5)
  },
  debug: (message, prop1, prop2, prop3, prop4, prop5) => {
    if (typeof message === 'string' && !prop1) {
      return simpleLogger.debug(message, prop1, prop2, prop3, prop4, prop5)
    }
    if (typeof message === 'object') {
      // remove the long emitter part of the object if available
      if (message.emitter) {
        message.emitter = 'redacted...too long'
      }
      message.prop1 = prop1
      message.prop2 = prop2
      message.prop3 = prop3
      message.prop4 = prop4
      message.prop5 = prop5
      return objectLogger.debug(message)
    }
    return objectLogger.debug(message, prop1, prop2, prop3, prop4, prop5)
  },
  error: (error, prop1, prop2, prop3, prop4, prop5) => {
    Sentry.captureException(error)
    if (typeof error === 'string' && !prop1) {
      return simpleLogger.error(error, prop1, prop2, prop3, prop4, prop5)
    }
    if (typeof error === 'object') {
      // remove the long emitter part of the object if available
      if (error.emitter) {
        error.emitter = 'redacted...too long'
      }
      error.prop1 = prop1
      error.prop2 = prop2
      error.prop3 = prop3
      error.prop4 = prop4
      error.prop5 = prop5
      return objectLogger.error(error)
    }
    return objectLogger.error(error, prop1, prop2, prop3, prop4, prop5)
  },
}

const loggerNoSentry = {
  ...logger,
  warn: (message, prop1, prop2, prop3, prop4, prop5) => {
    if (typeof message === 'string' && !prop1) {
      return simpleLogger.warn(message, prop1, prop2, prop3, prop4, prop5)
    }
    if (typeof message === 'object') {
      // remove the long emitter part of the object if available
      if (message.emitter) {
        message.emitter = 'redacted...too long'
      }
      message.prop1 = prop1
      message.prop2 = prop2
      message.prop3 = prop3
      message.prop4 = prop4
      message.prop5 = prop5
      return objectLogger.warn(message)
    }
    return objectLogger.warn(message, prop1, prop2, prop3, prop4, prop5)
  },
  error: (error, prop1, prop2, prop3, prop4, prop5) => {
    if (typeof error === 'string' && !prop1) {
      return simpleLogger.error(error, prop1, prop2, prop3, prop4, prop5)
    }
    if (typeof error === 'object') {
      // remove the long emitter part of the object if available
      if (error.emitter) {
        error.emitter = 'redacted...too long'
      }
      error.prop1 = prop1
      error.prop2 = prop2
      error.prop3 = prop3
      error.prop4 = prop4
      error.prop5 = prop5
      return objectLogger.error(error)
    }
    return objectLogger.error(error, prop1, prop2, prop3, prop4, prop5)
  },
}

exports.logger = logger
exports.loggerNoSentry = loggerNoSentry
exports.stream = stream
