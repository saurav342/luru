const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const tempUserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      trim: true,
      lowercase: true,
    },
   
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tempUserSchema.plugin(toJSON);
tempUserSchema.plugin(paginate);


tempUserSchema.statics.isPhoneNumberTaken = async function (phoneNumber, excludeTempUserId) {
  const tempUser = await this.findOne({ phoneNumber, _id: { $ne: excludeTempUserId } });
  return !!tempUser;
};


/**
 * @typedef TempUser
 */
const TempUser = mongoose.model('TempUser', tempUserSchema);

module.exports = TempUser;
