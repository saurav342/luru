const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createRideAssignment = {
  body: Joi.object().keys({
    ride: Joi.string().custom(objectId).required(),
    driver: Joi.string().custom(objectId).required(),
    status: Joi.string().valid('pending', 'accepted', 'rejected', 'completed', 'cancelled'),
    acceptedAt: Joi.date(),
    completedAt: Joi.date(),
    cancelledAt: Joi.date(),
    cancellationReason: Joi.string(),
  }),
};

const getRideAssignments = {
  query: Joi.object().keys({
    ride: Joi.string().custom(objectId),
    driver: Joi.string().custom(objectId),
    status: Joi.string().valid('pending', 'accepted', 'rejected', 'completed', 'cancelled'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getRideAssignment = {
  params: Joi.object().keys({
    rideAssignmentId: Joi.string().custom(objectId),
  }),
};

const updateRideAssignment = {
  params: Joi.object().keys({
    rideAssignmentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      ride: Joi.string().custom(objectId),
      driver: Joi.string().custom(objectId),
      status: Joi.string().valid('pending', 'accepted', 'rejected', 'completed', 'cancelled'),
      acceptedAt: Joi.date(),
      completedAt: Joi.date(),
      cancelledAt: Joi.date(),
      cancellationReason: Joi.string(),
    })
    .min(1),
};

const deleteRideAssignment = {
  params: Joi.object().keys({
    rideAssignmentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRideAssignment,
  getRideAssignments,
  getRideAssignment,
  updateRideAssignment,
  deleteRideAssignment,
};
