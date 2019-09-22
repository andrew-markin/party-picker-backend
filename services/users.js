const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');

const User = require('../models/users');

const authorize = function(user, cb) {
  jwt.sign({ 
    id: user._id,
    username: user.username
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

const register = function(req, cb) {
  User.create({
    username: req.username,
    password: req.password
  }, function (err, user) {
    if (err) {
      if (err.code !== 11000) return cb(err); 
      return cb(null, { success: false }); // Username exists
    }
    authorize(user, cb);
  });
};

const authenticate = function(req, cb) {
  User.findOne({
    username: req.username
  }, function(err, user) {
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
