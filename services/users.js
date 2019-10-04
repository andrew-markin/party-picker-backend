const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BCRYPT_SALT_ROUNDS = 10;

const noop = function() {};

const authorize = function(user, cb = noop) {
  jwt.sign({ 
    id: user._id,
    name: user.name
  }, process.env.JWT_SECRET, { 
    expiresIn: '1h' 
  }, function(err, token) {
    if (err) return cb(err);
    cb(null, {
      success: true,
      token: token
    });
  });
};

const register = function(req, cb = noop) {
  bcrypt.hash(req.password, BCRYPT_SALT_ROUNDS, function(err, hash) {
    if (err) return next(err);
    User.create({
      name: req.name,
      password: hash
    }, function (err, user) {
      if (err) {
        if (err.code !== 11000) return cb(err); 
        return cb(null, { success: false }); // User name exists
      }
      authorize(user, cb);
    });
  });
};

const authenticate = function(req, cb = noop) {
  User.findOne({ name: req.name }, function(err, user) {
    if (err) return cb(err);
    if (!user) return cb(null, { success: false });
    bcrypt.compare(req.password, user.password, function(err, matched) {
      if (err) return cb(err);
      if (!matched) return cb(null, { success: false });
      authorize(user, cb);
    });
  });
};

module.exports = {
  register: register,
  authenticate: authenticate
};
