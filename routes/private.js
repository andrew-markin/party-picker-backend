const express = require('express');

const parties = require('../services/parties');
const propositions = require('../services/propositions');
const { validate, body, param } = require('../utilities/validator');

var router = express.Router();

// User ID is mandatory for private calls
router.use(function(req, _res, next) {
  if (req.userId) return next();
  var err = new Error('Access denied');
  err.status = 401;
  next(err);
});

router.post('/parties', validate([
  body('name').exists().isString().trim().isLength({ min: 5 })
  .withMessage('Party name must be 5 characters long at least')
]), function(req, res, next) {
  parties.create({
    name: req.body.name
  }, function(err, result) {
    if (err) return next(err);
    res.json({
      success: true,
      party: result.party
    });
  });
});

router.put('/parties/:id/propositions', validate([
  param('id').isUUID(4).withMessage('Party ID must be an UUID v4'),
  body('accepts').optional().isArray().withMessage('Invalid array of accepts'),
  body('rejects').optional().isArray().withMessage('Invalid array of rejects'),
  body('resets').optional().isArray().withMessage('Invalid array of resets')
]), function(req, res, next) {
  propositions.update({
    party: req.params.id,
    userName: req.userName,
    accepts: req.body.accepts,
    rejects: req.body.rejects,
    resets: req.body.resets
  }, function(err) {
    if (err) return next(err);
    res.json({ success: true });
  });
});

module.exports = router;
