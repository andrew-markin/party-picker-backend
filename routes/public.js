const express = require('express')

const users = require('../services/users')
const parties = require('../services/parties')
const propositions = require('../services/propositions')
const { validate, param, query, body } = require('../utilities/validator')

var router = express.Router()

// Common validation checks

const checkUserName = body('name').exists().isString().trim()
  .isLength({ min: 5, max: 20 }).withMessage('Name must be 5-20 characters long')
  // eslint-disable-next-line no-useless-escape
  .matches(/^[a-zA-Z0-9\-]*$/).withMessage('Name can include only: a-z, A-Z, 0-9 and \'-\'')

const checkUserPassword = body('password').exists().isString().trim()
  .isLength({ min: 8, max: 32 }).withMessage('Password must be 8-32 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*?&])[A-Za-z\d_@$!%*?&]*$/)
  .withMessage('Password must include one lowercase letter, one uppercase letter, ' +
               'a number, and a special character (_@$!%*?&)')

const checkPartyId = param('id').isUUID(4).withMessage('Party ID must be an UUID v4')

// User registration
router.post('/users', validate([checkUserName, checkUserPassword]), function (req, res, next) {
  users.register({
    name: req.body.name,
    password: req.body.password
  }, function (err, result) {
    if (err) return next(err)
    if (!result.success) {
      return res.json({
        success: false,
        message: 'Name already exists'
      })
    }
    res.json({
      success: true,
      token: result.token
    })
  })
})

// User authentication
router.post('/users/auth', validate([checkUserName, checkUserPassword]), function (req, res, next) {
  users.authenticate({
    name: req.body.name,
    password: req.body.password
  }, function (err, result) {
    if (err) return next(err)
    if (!result.success) {
      return res.json({
        success: false,
        message: 'Wrong name or password'
      })
    }
    res.json({
      success: true,
      token: result.token
    })
  })
})

// Party
router.get('/parties/:id', validate([checkPartyId]), function (req, res, next) {
  parties.get({ id: req.params.id }, function (err, result) {
    if (err) return next(err)
    if (!result.success) {
      // eslint-disable-next-line no-redeclare
      var err = new Error('Party not found')
      err.status = 404
      return next(err)
    }
    res.json({
      success: true,
      party: result.party
    })
  })
})

// Propositions
router.get('/parties/:id/propositions', validate([
  checkPartyId,
  query('min').isInt({ min: 0 }).withMessage('Invalid min day value'),
  query('max').isInt({ min: 0 }).withMessage('Invalid max day value')
]), function (req, res, next) {
  propositions.select({
    party: req.params.id,
    min: req.query.min,
    max: req.query.max
  }, function (err, result) {
    if (err) return next(err)
    res.json({
      success: true,
      propositions: result.propositions
    })
  })
})

module.exports = router
