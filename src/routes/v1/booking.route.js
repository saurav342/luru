const express = require('express');
const bookingController = require('../../controllers/booking.controller');
const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const Gupshup = require('../../models/gupshup.model');

const router = express.Router();

router
  .route('/')
  .post(async (req, res, next) => {
    await bookingController.createBooking(req, res, next);
  })
  .get(async (req, res, next) => {
    try {
      const { page, limit, sortBy, populate, from, to, ...filter } = req.query;
      const options = {
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 25,
        sortBy,
        populate
      };

      // Add date filters to the filter object
      if (from) {
        filter.date = { ...filter.date, $gte: new Date(from) }; // Assuming 'date' is the field name in your bookings
      }
      if (to) {
        filter.date = { ...filter.date, $lte: new Date(to) }; // Assuming 'date' is the field name in your bookings
      }

      const bookings = await bookingController.getBookings(filter, options);
      res.send(bookings);
    } catch (error) {
      next(error);
    }
  });

router
  .route('/:bookingId')
  .get(async (req, res, next) => {
    try {
      const booking = await bookingController.getBookingById(req.params.bookingId);
      if (!booking) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
      }
      res.send(booking);
    } catch (error) {
      next(error);
    }
  })
  .patch(async (req, res, next) => {
    try {
      const booking = await bookingController.updateBookingById(req.params.bookingId, req.body);
      res.send(booking);
    } catch (error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await bookingController.deleteBookingById(req.params.bookingId);
      res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  });

// New route to get bookings by mobile number
router.get('/mobile/:mobileNumber', async (req, res, next) => {
  try {
    const { page, limit, sortBy, populate } = req.query;
    const options = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 25,
      sortBy,
      populate
    };
    
    const bookings = await bookingController.getBookingsByMobileNumber(req.params.mobileNumber, options);
    if (!bookings.totalResults) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No bookings found for this mobile number');
    }
    res.send(bookings);
  } catch (error) {
    next(error);
  }
});

// New route to save Gupshup message
router.post('/gupshup', async (req, res) => {
    const { profileName, waId, text, timestamp } = req.body;

    try {
        const gupshupMessage = new Gupshup({ profileName, waId, text, timestamp });
        await gupshupMessage.save();
        res.status(201).json(gupshupMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;