
const Ride = require('../models/ride.model');

const createRide = async (rideData) => {
  return Ride.create(rideData);
};

const queryRides = async (filter, options) => {
  const rides = await Ride.paginate(filter, options);
  return rides;
};

const getRideById = async (id) => {
  return Ride.findById(id);
};


const updateRideById = async (rideId, updateBody) => {
  const ride = await getRideById(rideId);
  if (!ride) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ride not found');
  }
  Object.assign(ride, updateBody);
  await ride.save();
  return ride;
};

const deleteRideById = async (rideId) => {
  const ride = await getRideById(rideId);
  if (!ride) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ride not found');
  }
  await ride.remove();
  return ride;
};

module.exports = {
  createRide,
  queryRides,
  getRideById,
  updateRideById,
  deleteRideById,
};
