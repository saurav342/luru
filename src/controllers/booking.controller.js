const httpStatus = require('http-status');
const { Booking } = require('../models');
const ApiError = require('../utils/ApiError');
const RideIdCounter = require('../models/rideIdCounter.model');

/**
 * Create a booking
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Promise<Booking>}
 */
const createBooking = async (req, res, next) => {
  try {
    const rideId = await generateRideId();
    const booking = new Booking({
      ...req.body,
      rideId,
    });
    const savedBooking = await booking.save();
    res.status(httpStatus.CREATED).send(savedBooking);
  } catch (error) {
    next(error);
  }
};

/**
 * Get booking by id
 * @param {ObjectId} id
 * @returns {Promise<Booking>}
 */
const getBookingById = async (id) => {
  return Booking.findById(id);
};

/**
 * Get all bookings
 * @param {Object} filter
 * @returns {Promise<Booking[]>}
 */
const getBookings = async (filter) => {
  return Booking.find(filter);
};

/**
 * Update booking by id
 * @param {ObjectId} bookingId
 * @param {Object} updateBody
 * @returns {Promise<Booking>}
 */
const updateBookingById = async (bookingId, updateBody) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  Object.assign(booking, updateBody);
  await booking.save();
  return booking;
};

/**
 * Delete booking by id
 * @param {ObjectId} bookingId
 * @returns {Promise<Booking>}
 */
const deleteBookingById = async (bookingId) => {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  await booking.remove();
  return booking;
};

const generateRideId = async () => {
  const prefix = 'BLR';
  const counter = await RideIdCounter.findOneAndUpdate(
    {}, 
    { $inc: { sequenceValue: 1 } }, 
    { new: true, upsert: true }
  );

  const sequence = counter.sequenceValue.toString().padStart(5, '0');
  return `${prefix}${sequence}`;
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingById,
  deleteBookingById,
}; 