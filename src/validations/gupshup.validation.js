const Joi = require('joi');

const gupshupSchema = Joi.object({
    profileName: Joi.string().required(),
    waId: Joi.string().required(),
    text: Joi.string().required(),
    timestamp: Joi.date().optional()
});

module.exports = gupshupSchema; 