// this is the ride controller and this file should contain all the ride related endpoints all the crud operations

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { rideService } = require('../services');

const createRide = catchAsync(async (req, res) => {
  try {
    const ride = await rideService.createRide(req.body);
    res.status(httpStatus.CREATED).send(ride);
  } catch (error) {
    console.log('..................', error);
    res.status(httpStatus.BAD_REQUEST).send({ message: error.message });
  }

});

const getRides = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status', 'driverId', 'passengerId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await rideService.queryRides(filter, options);
  res.send(result);
});

const getRide = catchAsync(async (req, res) => {
  const ride = await rideService.getRideById(req.params.rideId);
  if (!ride) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ride not found');
  }
  res.send(ride);
});


const getRideByUserPhoneNumber = catchAsync(async (req, res) => {
  const rides = await rideService.getRidesByUserId(req.params.userPhoneNumber);
  if (!rides || rides.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No rides found for this user');
  }
  res.send(rides);
});

const updateRide = catchAsync(async (req, res) => {
  const ride = await rideService.updateRideById(req.params.rideId, req.body);
  res.send(ride);
});

const deleteRide = catchAsync(async (req, res) => {
  await rideService.deleteRideById(req.params.rideId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRide,
  getRides,
  getRide,
  updateRide,
  deleteRide,
  getRideByUserPhoneNumber,
};

