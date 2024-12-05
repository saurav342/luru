const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { rideAssignmentService } = require('../services');

const createRideAssignment = catchAsync(async (req, res) => {
  const rideAssignment = await rideAssignmentService.createRideAssignment(req.body);
  res.status(httpStatus.CREATED).send(rideAssignment);
});

const getRideAssignments = catchAsync(async (req, res) => {
  const filter = req.query;
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  };
  const result = await rideAssignmentService.queryRideAssignments(filter, options);
  res.send(result);
});

const getRideAssignment = catchAsync(async (req, res) => {
  const rideAssignment = await rideAssignmentService.getRideAssignmentById(req.params.rideAssignmentId);
  if (!rideAssignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ride assignment not found');
  }
  res.send(rideAssignment);
});

const updateRideAssignment = catchAsync(async (req, res) => {
  const rideAssignment = await rideAssignmentService.updateRideAssignmentById(req.params.rideAssignmentId, req.body);
  res.send(rideAssignment);
});

const deleteRideAssignment = catchAsync(async (req, res) => {
  await rideAssignmentService.deleteRideAssignmentById(req.params.rideAssignmentId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRideAssignment,
  getRideAssignments,
  getRideAssignment,
  updateRideAssignment,
  deleteRideAssignment,
};
