const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  name: {
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

module.exports = mongoose.model('User', UserSchema);
