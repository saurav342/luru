const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const rideSchema = new mongoose.Schema({
  user: {
    fullName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
  },
  ride: {
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
    },
    destinationAddress: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    pickupTime: {
      type: String,
      required: true,
    },
    carSeats: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  driver: {
    id: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: false,
      trim: true,
    },
    carDetails: {
      type: String,
      required: false,
    },
  },
  payment: {
    amount: {
      type: Number,
      required: false,
      min: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      required: false,
      unique: false,
    },
  },
});

rideSchema.plugin(toJSON);
rideSchema.plugin(paginate);

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
