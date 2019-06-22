const jwt = require('jwt-simple')
const config = require('../../config')
const { logger } = require('../logger')

/**
 *
 * @param {number} id
 * @param {string} email
 * @returns {Promise<string>}
 */
const createToken = async (id, email) => {
  if (!id) {
    throw new Error('id is required')
  }

  if (!email) {
    throw new Error('email is required')
  }
  const jwtPayload = {
    id,
    email,
  }
  return jwt.encode(jwtPayload, config.tokenSecret, null, null)
}

/**
 *
 * @param {*} token
 * @returns {Promise<{id: number, email: string}>}
 */
const decodeToken = async token => {
  if (!token) {
    throw new Error(
      'This request or view requires you to be authenticated first. Not token provided. Please sign in.',
    )
  }

  let decoded
  try {
    decoded = jwt.decode(token, config.tokenSecret, null, null)
  } catch (error) {
    logger.error(error)
    throw new Error(
      'Your session token is invalid or has expired. Please sign in again.',
    )
  }

  if (!decoded.id) {
    logger.error(new Error('no id in decoded token'))
    throw new Error(
      'Your session token is invalid or has expired. Please sign in again.',
    )
  }

  if (!decoded.email) {
    logger.error(new Error('no email in decoded token'))
    throw new Error(
      'Your session token is invalid or has expired. Please sign in again.',
    )
  }

  return decoded
}

exports.createToken = createToken
exports.decodeToken = decodeToken
