const Joi = require('joi');
const { password } = require('./custom.validation');

const verifyOtp = {
  body: Joi.object().keys({
    otp: Joi.number().required(),
    phoneNumber: Joi.number().required(),
  }),
};

const sendOTP = {
  body: Joi.object().keys({
    phoneNumber: Joi.number().required(),
  }),
};




const login = {
  body: Joi.object().keys({
    phoneNumber: Joi.number().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyOtp,
  sendOTP,
};
