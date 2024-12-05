const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const rideAssignmentValidation = require('../../validations/rideAssignment.validation');
const rideAssignmentController = require('../../controllers/rideAssignment.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageRides'), validate(rideAssignmentValidation.createRideAssignment), rideAssignmentController.createRideAssignment)
  .get(auth('getRides'), validate(rideAssignmentValidation.getRideAssignments), rideAssignmentController.getRideAssignments);

router
  .route('/:rideAssignmentId')
  .get(auth('getRides'), validate(rideAssignmentValidation.getRideAssignment), rideAssignmentController.getRideAssignment)
  .patch(auth('manageRides'), validate(rideAssignmentValidation.updateRideAssignment), rideAssignmentController.updateRideAssignment)
  .delete(auth('manageRides'), validate(rideAssignmentValidation.deleteRideAssignment), rideAssignmentController.deleteRideAssignment);

module.exports = router;
