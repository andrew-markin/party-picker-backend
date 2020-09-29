const Party = require('../models/party')

const noop = function () {}

const get = function (req, cb = noop) {
  Party.findById(req.id, function (err, party) {
    if (err) return cb(err)
    if (!party) return cb(null, { success: false })
    cb(null, {
      success: true,
      party: {
        id: party._id,
        name: party.name
      }
    })
  })
}

const create = function (req, cb = noop) {
  Party.create({
    name: req.name
  }, function (err, party) {
    if (err) return cb(err)
    cb(null, {
      success: true,
      party: {
        id: party._id,
        name: party.name
      }
    })
  })
}

module.exports = {
  get: get,
  create: create
}
