const express = require('express');
const auth = require('../../middlewares/auth');
const rideController = require('../../controllers/ride.controller');
const rideValidation = require('../../validations/ride.validation');
const validate = require('../../middlewares/validate');
const router = express.Router();

router.route('/')
  .post(auth('createRide'), rideController.createRide)
  .get(auth('getRides'), rideController.getRides)
  // .get(rideController.getRides);

router.route('/:rideId')
  .put(rideController.updateRide);

module.exports = router;