const express = require('express');
const validate = require('../../middlewares/validate');
// const carValidation = require('../../validations/car.validation');
const carController = require('../../controllers/car.controller');

const router = express.Router();

router
  .route('/')
  .post(carController.createCar)
  .get(carController.getCars);

router
  .route('/:carId')
  .get( carController.getCar)
  .patch(carController.updateCar)
  .delete(carController.deleteCar);

module.exports = router;