const bcrypt = require('bcrypt-nodejs')

/**
 *
 * @param {string} password - typically the user entered password
 * @param {string} encryptedPassword - typically the password that was previously hashed by bcrypt
 * @returns {Promise.<boolean>}
 */
module.exports = (password, encryptedPassword) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, encryptedPassword, (err, matches) => {
      if (err) {
        reject(err)
      } else {
        resolve(matches)
      }
    })
  })
