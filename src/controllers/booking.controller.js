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
 * Get all bookings with pagination
 * @param {Object} filter - Filter options
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const getBookings = async (filter, options) => {
  const bookings = await Booking.paginate(filter, options);
  return bookings;
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

  const { status } = updateBody;

  // Validate status transition
  if (status) {
    const currentStatus = booking.status;

    // Check if the new status is the same as the current status
    if (currentStatus === status) {
      throw new ApiError(httpStatus.BAD_REQUEST, `The status is already set to ${currentStatus}. No update is needed.`);
    }

    // Validate status transitions
    if (currentStatus === 'pending') {
      if (status !== 'confirmed' && status !== 'rejected') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status transition from pending. Must be confirmed or rejected.');
      }
    } else if (currentStatus === 'confirmed' || currentStatus === 'rejected') {
      if (status !== 'completed' && status !== 'cancelled' && status !== 'scheduled') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status transition from confirmed/rejected. Must be completed, cancelled, or scheduled.');
      }
    } else if (currentStatus === 'completed' || currentStatus === 'cancelled' || currentStatus === 'scheduled') {
      // Prevent transitioning from completed, cancelled, or scheduled to any other status
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot change status from completed, cancelled, or scheduled to another status.');
    }
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