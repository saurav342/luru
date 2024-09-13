const Ride = require("../../models/ride.model")

const express = require('express');
const rideController = require('../../controllers/ride.controller');
// const rideValidation = require('../../validations/ride.validation');
const validate = require('../../middlewares/validate');
const router = express.Router();

router.route('/')
.post(rideController.createRide)
.put(rideController.updateRide)
.get(rideController.getRides);

module.exports = router;

