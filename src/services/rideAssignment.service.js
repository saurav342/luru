const httpStatus = require('http-status');
const { RideAssignment } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a ride assignment
 * @param {Object} rideAssignmentBody
 * @returns {Promise<RideAssignment>}
 */
const createRideAssignment = async (rideAssignmentBody) => {
  return RideAssignment.create(rideAssignmentBody);
};

/**
 * Query for ride assignments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryRideAssignments = async (filter, options) => {
  const rideAssignments = await RideAssignment.paginate(filter, options);
  return rideAssignments;
};

/**
 * Get ride assignment by id
 * @param {ObjectId} id
 * @returns {Promise<RideAssignment>}
 */
const getRideAssignmentById = async (id) => {
  return RideAssignment.findById(id);
};

/**
 * Update ride assignment by id
 * @param {ObjectId} rideAssignmentId
 * @param {Object} updateBody
 * @returns {Promise<RideAssignment>}
 */
const updateRideAssignmentById = async (rideAssignmentId, updateBody) => {
  const rideAssignment = await getRideAssignmentById(rideAssignmentId);
  if (!rideAssignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ride assignment not found');
  }
  Object.assign(rideAssignment, updateBody);
  await rideAssignment.save();
  return rideAssignment;
};

/**
 * Delete ride assignment by id
 * @param {ObjectId} rideAssignmentId
 * @returns {Promise<RideAssignment>}
 */
const deleteRideAssignmentById = async (rideAssignmentId) => {
  const rideAssignment = await getRideAssignmentById(rideAssignmentId);
  if (!rideAssignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Ride assignment not found');
  }
  await rideAssignment.remove();
  return rideAssignment;
};

module.exports = {
  createRideAssignment,
  queryRideAssignments,
  getRideAssignmentById,
  updateRideAssignmentById,
  deleteRideAssignmentById,
};
