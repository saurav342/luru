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
      const { page, limit, sortBy, populate, ...filter } = req.query;
      const options = {
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 25,
        sortBy,
        populate
      };
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