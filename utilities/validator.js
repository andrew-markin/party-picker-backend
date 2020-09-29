const validator = require('express-validator')

module.exports = {
  check: validator.check,
  body: validator.body,
  cookie: validator.cookie,
  header: validator.header,
  param: validator.param,
  query: validator.query,
  validate: function (validators) {
    if (!Array.isArray(validators)) validators = [validators]
    return [...validators, function (req, _res, next) {
      const errors = validator.validationResult(req).array()
      if (errors.length) {
        const err = new Error(errors[0].msg)
        err.status = 422
        return next(err)
      }
      next()
    }]
  }
}
