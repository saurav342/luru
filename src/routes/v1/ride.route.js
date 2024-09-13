const express = require('express');
const rideController = require('../../controllers/ride.controller');
// const rideValidation = require('../../validations/ride.validation');
const validate = require('../../middlewares/validate');
const router = express.Router();

router.route('/')
  .post(rideController.createRide)
  .get(rideController.getRides);

router.route('/:rideId')
  .put(rideController.updateRide);

module.exports = router;