const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
  }
});

// Hash user password before saving into database
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, saltRounds, function(err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);
