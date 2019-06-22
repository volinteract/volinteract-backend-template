module.exports = {
  appName: 'Backend Starter',

  serviceName: 'Backend Starter',

  appDomain: process.env.APP_DOMAIN || 'http://localhost',

  appUrl:
    process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}/`,

  port: process.env.PORT || 5000,

  tokenSecret: process.env.TOKEN_SECRET || 'reughdjsasdkpmasipkmsdfadf',

  db: {
    max_connections: Number.isNaN(Number(process.env.DB_MAX_CONNECTIONS))
      ? 10
      : Number(process.env.DB_MAX_CONNECTIONS),
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  testDb: process.env.TESTDATABASE_URL,

  logLevel: process.env.LOG_LEVEL || 'info',

  sentry: {
    dsn: 'https://8832ef19acb24ea8a2bfbf2b3c2338c3@sentry.io/1439736',
  },
}
