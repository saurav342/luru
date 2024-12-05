const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const driverSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
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
    }
  },
  {
    timestamps: true,
  }
);

// add plugins
driverSchema.plugin(toJSON);
driverSchema.plugin(paginate);

// Create a 2dsphere index for location-based queries
driverSchema.index({ currentLocation: '2dsphere' });

const Driver = mongoose.model('Driver', driverSchema);

module.exports = Driver; 