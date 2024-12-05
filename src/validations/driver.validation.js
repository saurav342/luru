const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDriver = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    userId: Joi.string().custom(objectId).required(),
    licenseNumber: Joi.string().required(),
    isAvailable: Joi.boolean(),
    currentLocation: Joi.object().keys({
      type: Joi.string().valid('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2),
    }),
    isVerified: Joi.boolean(),
  }),
};

const getDrivers = {
  query: Joi.object().keys({
    isAvailable: Joi.boolean(),
    isVerified: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDriver = {
  params: Joi.object().keys({
    driverId: Joi.string().custom(objectId),
  }),
};

const getDriverByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateDriver = {
  params: Joi.object().keys({
    driverId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      licenseNumber: Joi.string(),
      isAvailable: Joi.boolean(),
      currentLocation: Joi.object().keys({
        type: Joi.string().valid('Point'),
        coordinates: Joi.array().items(Joi.number()).length(2),
      }),
      isVerified: Joi.boolean(),
    })
    .min(1),
};

const deleteDriver = {
  params: Joi.object().keys({
    driverId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createDriver,
  getDrivers,
  getDriver,
  getDriverByUserId,
  updateDriver,
  deleteDriver,
}; 