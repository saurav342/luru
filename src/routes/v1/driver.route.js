const express = require('express');
const router = express.Router();
const Driver = require('../../models/driver.model');
const Joi = require('joi');

// Validation schema
const driverSchema = Joi.object({
  id: Joi.string().optional(),
  name: Joi.string().required(),
  phone: Joi.string().required(),
  weeklyOff: Joi.string().optional(),
  status: Joi.string().valid('active', 'inactive').optional(),
  slotStartTime: Joi.string().pattern(/^\d{2}:\d{2}$/).optional(),
  slotEndTime: Joi.string().pattern(/^\d{2}:\d{2}$/).optional(),
  overtimeAvailability: Joi.boolean().optional(),
  vehicleNumber: Joi.string().required()
});

// Create a Driver
router.post('/', async (req, res) => {
  const { error } = driverSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const driver = new Driver(req.body);
  try {
    await driver.save();
    res.status(201).send(driver);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get All Drivers with Pagination and Search
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ]
  };

  try {
    const drivers = await Driver.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Driver.countDocuments(query);
    res.json({
      drivers,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get a Single Driver by ID
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findOne({ id: req.params.id });
    if (!driver) return res.status(404).send('Driver not found');
    res.send(driver);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a Driver
router.put('/:id', async (req, res) => {
  const { error } = driverSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const driver = await Driver.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!driver) return res.status(404).send('Driver not found');
    res.send(driver);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a Driver
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({ id: req.params.id });
    if (!driver) return res.status(404).send('Driver not found');
    res.send(driver);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router; 