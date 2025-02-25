const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
// const driverValidation = require('../../validations/driver.validation');
const driverController = require('../../controllers/driver.controller');

const router = express.Router();

router
  .route('/')
  .post( driverController.createDriver)
  .get(driverController.getDrivers);

// router
//   .route('/:driverId')
//   .get(auth('getDrivers'), validate(driverValidation.getDriver), driverController.getDriver)
//   .put(auth('manageDrivers'), validate(driverValidation.updateDriver), driverController.updateDriver)
//   .delete(auth('manageDrivers'), validate(driverValidation.deleteDriver), driverController.deleteDriver);

// router
//   .route('/user/:userId')
//   .get(auth('getDrivers'), validate(driverValidation.getDriverByUserId), driverController.getDriverByUserId);

// Keep your existing routes
// router.get('/getAssignedDriverRide', driverController.getAssignedDriverRide);
// router.put('/updateRide', driverController.updateRide);

module.exports = router;