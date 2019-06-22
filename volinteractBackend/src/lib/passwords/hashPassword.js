const bcrypt = require('bcrypt-nodejs')

/**
 *
 * @param {string} password - typically the user entered password
 * @returns {Promise.<string>}
 */
module.exports = password =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, null, null, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
