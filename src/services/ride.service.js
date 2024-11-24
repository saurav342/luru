
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
  console.log('...................1.........', ride);
  console.log('....................2........', updateBody);
  Object.assign(ride, {ride : {...ride.ride, ...updateBody}});
  console.log('....................3........', ride);
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


const getRidesByUserId = async (userId) => {
  const rides = await Ride.find({ "user.phoneNumber" : userId });
  return rides;
};

module.exports = {
  createRide,
  queryRides,
  getRideById,
  updateRideById,
  deleteRideById,
  getRidesByUserId,
};
