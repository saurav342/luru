const express = require('express');
const router = express.Router();
const Booking = require('../../models/booking.model');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const bookingController = require('../../controllers/booking.controller');

// Create a new booking
router.post('/', auth(), validate(createBooking), bookingController.createBooking);

// Get all bookings with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Search by mobile number if provided
    if (req.query.mobile) {
      query.mobile = req.query.mobile;
    }

    const bookings = await Booking.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      },
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update booking
router.put('/:id', async (req, res) => {
  try {
    // Only allow updating specific fields
    const allowedUpdates = ['status', 'dateTime', 'notes'];
    const updates = Object.keys(req.body)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add a new route for the thank you page
router.get('/thank-you/:bookingId', auth(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('carId')
      .populate('userId');
    
    if (!booking) {
      return res.status(404).send({ message: 'Booking not found' });
    }

    res.json({
      success: true,
      booking,
      message: 'Thank you for your booking!'
    });
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving booking details' });
  }
});

module.exports = router; 