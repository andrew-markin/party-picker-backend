const mongoose = require('mongoose')
const uuidv4 = require('uuid/v4')

var PartySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
})

module.exports = mongoose.model('Party', PartySchema)
