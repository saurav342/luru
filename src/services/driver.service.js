// Service for driver-related operations

const httpStatus = require('http-status');
const { Driver } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a driver
 * @param {Object} driverBody
 * @returns {Promise<Driver>}
 */
const createDriver = async (driverBody) => {
    console.log('...driverBody...', driverBody);
  if (await Driver.findOne({ licenseNumber: driverBody.licenseNumber })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'License number already taken');
  }
  return Driver.create(driverBody);
};

/**
 * Query for drivers
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryDrivers = async (filter, options) => {
  const drivers = await Driver.paginate(filter, options);
  return drivers;
};

/**
 * Get driver by id
 * @param {ObjectId} id
 * @returns {Promise<Driver>}
 */
const getDriverById = async (id) => {
  return Driver.findById(id).populate('userId');
};

/**
 * Get driver by userId
 * @param {ObjectId} userId
 * @returns {Promise<Driver>}
 */
const getDriverByUserId = async (userId) => {
  return Driver.findOne({ userId }).populate('userId');
};

/**
 * Update driver by id
 * @param {ObjectId} driverId
 * @param {Object} updateBody
 * @returns {Promise<Driver>}
 */
const updateDriverById = async (driverId, updateBody) => {
  const driver = await getDriverById(driverId);
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  if (updateBody.licenseNumber && (await Driver.findOne({ licenseNumber: updateBody.licenseNumber, _id: { $ne: driverId } }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'License number already taken');
  }
  Object.assign(driver, updateBody);
  await driver.save();
  return driver;
};

/**
 * Delete driver by id
 * @param {ObjectId} driverId
 * @returns {Promise<Driver>}
 */
const deleteDriverById = async (driverId) => {
  const driver = await getDriverById(driverId);
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Driver not found');
  }
  await driver.remove();
  return driver;
};

module.exports = {
  createDriver,
  queryDrivers,
  getDriverById,
  getDriverByUserId,
  updateDriverById,
  deleteDriverById,
};