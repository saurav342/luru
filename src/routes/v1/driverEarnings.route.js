const express = require('express');
const router = express.Router();

const earningsController = require('../../controllers/earning.controller');


// GET /earnings - Get aggregated earnings data
router.get('/', earningsController.getEarnings);

module.exports = router; 