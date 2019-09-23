const express = require('express');

const users = require('../services/users');
const { validate, body } = require('../utilities/validator');

var router = express.Router();

// Common validation checks

const checkUsername = body('username').exists().isString().trim()
  .isLength({ min: 5, max: 20 }).withMessage('Username must be 5-20 characters long')
  .matches(/^[a-zA-Z0-9\-]*$/).withMessage('Username can include only: a-z, A-Z, 0-9 and \'-\'');

const checkPassword = body('password').exists().isString().trim()
  .isLength({ min: 8, max: 32 }).withMessage('Password must be 8-32 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*?&])[A-Za-z\d_@$!%*?&]*$/)
  .withMessage('Password must include one lowercase letter, one uppercase letter, ' +
               'a number, and a special character (_@$!%*?&)');

// User registration
router.post('/users', validate([checkUsername, checkPassword]), function(req, res, next) {
  users.register({
    username: req.body.username,
    password: req.body.password
  }, function(err, result) {
    if (err) return next(err);
    if (!result.success) {
      return res.json({
        success: false,
        message: 'Username already exists'
      }); 
    }
    res.json({
      success: true,
      token: result.token
    });
  });
});

// User authentication
router.post('/users/auth', validate([checkUsername, checkPassword]), function(req, res, next) {
  users.authenticate({
    username: req.body.username,
    password: req.body.password
  }, function(err, result) {
    if (err) return next(err);
    if (!result.success) {
      return res.json({
        success: false,
        message: 'Wrong username or password'
      }); 
    }
    res.json({
      success: true,
      token: result.token
    });
  });
});

module.exports = router;