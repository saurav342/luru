const Ride = require('../models/ride.model');
const Driver = require('../models/driver.model'); // assuming Driver model is defined in driver.model.js
const CarAssignment = require('../models/carAssignment.model'); // assuming CarAssignment model is defined in carAssignment.model.js
const User = require('../models/user.model'); // assuming User model is defined in user.model.js
const ApiError = require('../../src/utils/ApiError');

const createRide = async (rideBody) => {
  const user = await User.findById(rideBody.user.id);
  // if (!user) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  // }
  const ride = new Ride({
    ...rideBody,
    userName: user.name,
  });
  await ride.save();
  return ride;
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
  
  if (updateBody.driverId) {
    const driver = await Driver.findById(updateBody.driverId);
    if (!driver) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
    }
    const carAssignment = await CarAssignment.findOne({ driver: driver._id }).populate('car');
    updateBody.driver = {
      currentLocation: driver.currentLocation,
      isAvailable: driver.isAvailable,
      rating: driver.rating,
      totalRides: driver.totalRides,
      isVerified: driver.isVerified,
      name: driver.name || '',
      licenseNumber: driver.licenseNumber || '',
      driverIdentity: driver.driverIdentity || '',
      carDetails: carAssignment ? carAssignment.car : null,
    };
  }
  
  Object.assign(ride, updateBody);
  
  // Mark the ride status as 'live'
  ride.ride.status = 'live';

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
  console.log('............uswrr id ........', userId);
  const rides = await Ride.find({ "user.phoneNumber" : userId });
  return rides;
};

const getRidesByDriverIdentity = async (driverIdentity) => {
  const rides = await Ride.find({ 'driver.driverIdentity': driverIdentity });

  const updatedRides = rides.map(async (ride) => {
    const rideObj = ride.toObject(); // Convert to plain object
    const user = await User.findById(ride.user.id);
    if (user) {
      rideObj.user = rideObj.user || {}; // Ensure ride.user exists
      rideObj.user.name = user.name; // Add the user's name to ride.user
    }
    return rideObj;
  });

  return Promise.all(updatedRides); // Wait for all modifications to complete
};

module.exports = {
  createRide,
  queryRides,
  getRideById,
  updateRideById,
  deleteRideById,
  getRidesByUserId,
  getRidesByDriverIdentity,
};
