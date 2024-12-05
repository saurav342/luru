const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCarAssignment = {
  body: Joi.object().keys({
    car: Joi.string().custom(objectId).required(),
    driver: Joi.string().custom(objectId).required(),
    status: Joi.string().valid('pending', 'assigned', 'unassigned'),
    assignedAt: Joi.date(),
    unassignedAt: Joi.date(),
  }),
};

const getCarAssignments = {
  query: Joi.object().keys({
    car: Joi.string().custom(objectId),
    driver: Joi.string().custom(objectId),
    status: Joi.string().valid('pending', 'assigned', 'unassigned'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCarAssignment = {
  params: Joi.object().keys({
    carAssignmentId: Joi.string().custom(objectId),
  }),
};

const updateCarAssignment = {
  params: Joi.object().keys({
    carAssignmentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      car: Joi.string().custom(objectId),
      driver: Joi.string().custom(objectId),
      status: Joi.string().valid('pending', 'assigned', 'unassigned'),
      assignedAt: Joi.date(),
      unassignedAt: Joi.date(),
    })
    .min(1),
};

const deleteCarAssignment = {
  params: Joi.object().keys({
    carAssignmentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCarAssignment,
  getCarAssignments,
  getCarAssignment,
  updateCarAssignment,
  deleteCarAssignment,
};
