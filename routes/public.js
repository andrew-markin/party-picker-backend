const express = require('express');
const users = require('../services/users');

var router = express.Router();

// User registration
router.post('/users', function(req, res, next) {
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
router.post('/users/auth', function(req, res, next) {
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