const httpStatus = require('http-status');
const { CarAssignment } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a car assignment
 * @param {Object} carAssignmentBody
 * @returns {Promise<CarAssignment>}
 */
const createCarAssignment = async (carAssignmentBody) => {
  return CarAssignment.create(carAssignmentBody);
};

/**
 * Query for car assignments
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryCarAssignments = async (filter, options) => {
  const carAssignments = await CarAssignment.paginate(filter, options);
  return carAssignments;
};

/**
 * Get car assignment by id
 * @param {ObjectId} id
 * @returns {Promise<CarAssignment>}
 */
const getCarAssignmentById = async (id) => {
  return CarAssignment.findById(id);
};

/**
 * Update car assignment by id
 * @param {ObjectId} carAssignmentId
 * @param {Object} updateBody
 * @returns {Promise<CarAssignment>}
 */
const updateCarAssignmentById = async (carAssignmentId, updateBody) => {
  const carAssignment = await getCarAssignmentById(carAssignmentId);
  if (!carAssignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car assignment not found');
  }
  Object.assign(carAssignment, updateBody);
  await carAssignment.save();
  return carAssignment;
};

/**
 * Delete car assignment by id
 * @param {ObjectId} carAssignmentId
 * @returns {Promise<CarAssignment>}
 */
const deleteCarAssignmentById = async (carAssignmentId) => {
  const carAssignment = await getCarAssignmentById(carAssignmentId);
  if (!carAssignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Car assignment not found');
  }
  await carAssignment.remove();
  return carAssignment;
};

module.exports = {
  createCarAssignment,
  queryCarAssignments,
  getCarAssignmentById,
  updateCarAssignmentById,
  deleteCarAssignmentById,
};
