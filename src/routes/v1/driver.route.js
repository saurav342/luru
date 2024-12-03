const express = require('express');
const { getAssignedDriverRide, updateRide } = require('../../controllers/driver.controller');

const router = express.Router();

// Define the routes
router.get('/getAssignedDriverRide', getAssignedDriverRide);
router.put('/updateRide', updateRide);

module.exports = router;