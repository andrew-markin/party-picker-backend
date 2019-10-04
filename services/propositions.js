const Proposition = require('../models/proposition');

const noop = function() {};

const select = function(req, cb = noop) {
  // TODO: Limit min and max values
  Proposition.find({
    party: req.party,
    day: { $gte: req.min },
    day: { $lte: req.max }
  }, 'day acceptors rejectors -_id', function(err, propositions) {
    if (err) return cb(err);
    var map = {};
    // Compose propositions into map
    propositions.forEach(function(proposition) {
      map[proposition.day] = {
        acceptors: proposition.acceptors,
        rejectors: proposition.rejectors
      }
    });
    cb(null, {
      success: true,
      propositions: map
    })
  });
};

const update = function(req, cb = noop) {
  var ops = [];
  // Operations for accepts
  (req.accepts || []).forEach(function(day) {
    ops.push({
      updateOne: {
        filter: { 
          party: req.party,
          day: day
        },
        update: {
          $addToSet: { acceptors: req.userName },
          $pull: { rejectors: req.userName }
        },
        upsert: true
      }
    });
  });
  // Operations for rejects
  (req.rejects || []).forEach(function(day) {
    ops.push({
      updateOne: {
        filter: { 
          party: req.party,
          day: day
        },
        update: {
          $addToSet: { rejectors: req.userName },
          $pull: { acceptors: req.userName }
        },
        upsert: true
      }
    });
  });
  // Operations for resets
  (req.resets || []).forEach(function(day) {
    ops.push({
      updateOne: {
        filter: { 
          party: req.party,
          day: day
        },
        update: {
          $pull: {
            acceptors: req.userName,
            rejectors: req.userName 
          }
        }
      }
    });
    ops.push({
      deleteOne: {
        filter: { 
          party: req.party,
          day: day,
          $and: [
            { $or: [ { acceptors: { $exists: false } }, { acceptors: { $size: 0 } } ] },
            { $or: [ { rejectors: { $exists: false } }, { rejectors: { $size: 0 } } ] }
          ]
        }
      }
    });
  });
  // Submit operations if needed
  if (ops.length === 0) return cb(null);
  Proposition.bulkWrite(ops, function(err) {
    if (err) return cb(err);
    cb(null);
  });
};

module.exports = {
  select: select,
  update: update
};
