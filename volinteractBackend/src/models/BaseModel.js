const { Model } = require('objection')
const moment = require('moment')
const knex = require('../lib/knex')

Model.knex(knex)

class BaseModel extends Model {
  static validateDate(fieldName, value) {
    if (typeof value !== 'undefined') {
      if (typeof fieldName !== 'string') {
        throw new Error(
          `${fieldName} should be a valid date string in ISO format`,
        )
      }
      if (!moment(value, moment.ISO_8601).isValid()) {
        throw new Error(`${fieldName} must be a valid date`)
      }
    }
  }

  static validateIdLike(fieldName, value, greaterThanOne = true) {
    if (typeof value !== 'undefined') {
      if (typeof value !== 'number') {
        throw new Error(`${fieldName} must be an integer`)
      }
      if (greaterThanOne) {
        if (value < 1) {
          throw new Error(`${fieldName} must be greater than 1`)
        }
      }
    }
  }

  static validateNumber(fieldName, value) {
    if (typeof value !== 'undefined') {
      if (typeof value !== 'number') {
        throw new Error(`${fieldName} must be an number`)
      }
    }
  }

  static validateBoolean(fieldName, value) {
    if (typeof value !== 'undefined') {
      if (typeof value !== 'boolean') {
        throw new Error(`${fieldName} must be an boolean`)
      }
    }
  }

  static validateString(constraint, fieldName, value) {
    if (typeof value !== 'undefined') {
      if (typeof value !== 'string') {
        throw new Error(`${fieldName} must be a string, got ${value}`)
      }
      if (value.length < constraint.minLength) {
        throw new Error(
          `${fieldName} must be at least ${
            constraint.minLength
          } character(s) long`,
        )
      }
      if (value.length > constraint.maxLength) {
        throw new Error(
          `${fieldName} must be at most ${
            constraint.maxLength
          } character(s) long`,
        )
      }
      if (!constraint.pattern.test(value)) {
        throw new Error(`${fieldName}: ${constraint.patternMessage}`)
      }
    }
  }

  $normalizeString(fieldKey) {
    if (typeof this[fieldKey] !== 'undefined') {
      this.$set({
        [fieldKey]: this[fieldKey].trim(),
      })
    }
  }

  $requireField(fieldName, fieldKey) {
    if (typeof this[fieldKey] === 'undefined') {
      throw new Error(`${fieldName} is required.`)
    }
  }
}

module.exports = BaseModel
