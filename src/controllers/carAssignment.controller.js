const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { carAssignmentService } = require('../services');

const createCarAssignment = catchAsync(async (req, res) => {
  const carAssignment = await carAssignmentService.createCarAssignment(req.body);
  res.status(httpStatus.CREATED).send(carAssignment);
});

const getCarAssignments = catchAsync(async (req, res) => {
  const filter = req.query;
  const options = {
    sortBy: req.query.sortBy,
    limit: req.query.limit,
    page: req.query.page,
  };
  const result = await carAssignmentService.queryCarAssignments(filter, options);
  res.send(result);
});

const getCarAssignment = catchAsync(async (req, res) => {
  const carAssignment = await carAssignmentService.getCarAssignmentById(req.params.carAssignmentId);
  if (!carAssignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car assignment not found');
  }
  res.send(carAssignment);
});

const updateCarAssignment = catchAsync(async (req, res) => {
  const carAssignment = await carAssignmentService.updateCarAssignmentById(req.params.carAssignmentId, req.body);
  res.send(carAssignment);
});

const deleteCarAssignment = catchAsync(async (req, res) => {
  await carAssignmentService.deleteCarAssignmentById(req.params.carAssignmentId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCarAssignment,
  getCarAssignments,
  getCarAssignment,
  updateCarAssignment,
  deleteCarAssignment,
};
