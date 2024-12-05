const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const carAssignmentValidation = require('../../validations/carAssignment.validation');
const carAssignmentController = require('../../controllers/carAssignment.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageCars'), validate(carAssignmentValidation.createCarAssignment), carAssignmentController.createCarAssignment)
  .get(auth('getCars'), validate(carAssignmentValidation.getCarAssignments), carAssignmentController.getCarAssignments);

router
  .route('/:carAssignmentId')
  .get(auth('getCars'), validate(carAssignmentValidation.getCarAssignment), carAssignmentController.getCarAssignment)
  .patch(auth('manageCars'), validate(carAssignmentValidation.updateCarAssignment), carAssignmentController.updateCarAssignment)
  .delete(auth('manageCars'), validate(carAssignmentValidation.deleteCarAssignment), carAssignmentController.deleteCarAssignment);

module.exports = router;
