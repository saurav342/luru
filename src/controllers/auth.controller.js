const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const sendOTP = catchAsync(async (req, res) => {
  const user = await userService.createTempUser(req.body);
  res.status(200).send({user});
});

const verifyOtp = catchAsync(async (req, res) => {
  const { otp } = req.body;
  if(otp === 1234) {
    const isUserExists = await userService.getUserByPhoneNumber(req.body.phoneNumber);
    if(isUserExists) {
      const tokens = await tokenService.generateAuthTokens(isUserExists);
      res.status(httpStatus.OK).send({ user: isUserExists, tokens });
    } else {
      const user = await userService.createUser(req.body);
      const tokens = await tokenService.generateAuthTokens(user);
      res.status(httpStatus.CREATED).send({ user, tokens });
    }

  } else {
    res.status(httpStatus.BAD_REQUEST).send({ message: 'Invalid OTP' });
  }
});


const login = catchAsync(async (req, res) => {
  const { phoneNumber } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const loginDriver = catchAsync(async (req, res) => {
  try {
    const driver = await authService.loginDriverWithIdentityAndPassword(req.body.driverIdentity, req.body.password);
    const tokens = await tokenService.generateAuthTokens(driver);
    res.send({ driver, tokens });
  } catch (error) {
    console.log('..................', error);
    res.status(httpStatus.UNAUTHORIZED).send({ message: error.message });
  }
});

const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, role: 'admin' }); // Assuming you have a role field
    console.log('..................', admin);
    if (!admin) {
      // if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password');
    }

    const tokens = await tokenService.generateAuthTokens(admin); // Assuming you have a function to generate tokens
    res.status(httpStatus.OK).send({ user: admin, tokens });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  sendOTP,
  verifyOtp,
  loginDriver,
  loginAdmin,
};
