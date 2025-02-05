const express = require('express');
const bookingController = require('../../controllers/booking.controller');
const router = express.Router();

router
  .route('/')
  .post(async (req, res) => {
    const booking = await bookingController.createBooking(req.body);
    res.status(201).send(booking);
  })
  .get(async (req, res) => {
    const bookings = await bookingController.getBookings(req.query);
    res.send(bookings);
  });

router
  .route('/:bookingId')
  .get(async (req, res) => {
    const booking = await bookingController.getBookingById(req.params.bookingId);
    res.send(booking);
  })
  .patch(async (req, res) => {
    const booking = await bookingController.updateBookingById(req.params.bookingId, req.body);
    res.send(booking);
  })
  .delete(async (req, res) => {
    await bookingController.deleteBookingById(req.params.bookingId);
    res.status(204).send();
  });

module.exports = router;