const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const driverSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalRides: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    driverIdentity: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      private: true, // used by the toJSON plugin
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate driverIdentity
// Incremental logic for driverIdentity
let counter = 1; // This should ideally be stored in a persistent way, such as in a database or a separate collection

driverSchema.pre('save', async function (next) {
  const driver = this;
  if (!driver.driverIdentity) {
    driver.driverIdentity = `B${String(counter).padStart(1, '0')}`;
    counter += 1; // Increment the counter for the next driver
  }
  if (driver.isModified('password')) {
    driver.password = await bcrypt.hash(driver.password, 8);
  }
  next();
});

// Middleware to hash password before saving
// Check if password matches the driver's password
driverSchema.methods.isPasswordMatch = async function (password) {
  const driver = this;
  return bcrypt.compare(password, driver.password);
};

// add plugins
driverSchema.plugin(toJSON);
driverSchema.plugin(paginate);

// Create a 2dsphere index for location-based queries
driverSchema.index({ currentLocation: '2dsphere' });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver; 