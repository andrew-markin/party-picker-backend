const mongoose = require('mongoose')

var PropositionSchema = new mongoose.Schema({
  party: {
    type: String,
    ref: 'Party',
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  acceptors: [String],
  rejectors: [String]
})

PropositionSchema.index({ party: 1, day: 1 }, { unique: true })

module.exports = mongoose.model('Proposition', PropositionSchema)
