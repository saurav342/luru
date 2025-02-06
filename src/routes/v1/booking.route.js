const express = require('express');
const bookingController = require('../../controllers/booking.controller');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const router = express.Router();

router
  .route('/')
  .post(async (req, res, next) => {
    await bookingController.createBooking(req, res, next);
  })
  .get(async (req, res, next) => {
    try {
      const bookings = await bookingController.getBookings(req.query);
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

module.exports = router;