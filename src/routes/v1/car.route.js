const express = require('express');
const validate = require('../../middlewares/validate');
const carValidation = require('../../validations/car.validation');
const carController = require('../../controllers/car.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(carValidation.createCar), carController.createCar)
  .get(validate(carValidation.getCars), carController.getCars);

router
  .route('/:carId')
  .get(validate(carValidation.getCar), carController.getCar)
  .patch(validate(carValidation.updateCar), carController.updateCar)
  .delete(validate(carValidation.deleteCar), carController.deleteCar);

module.exports = router;