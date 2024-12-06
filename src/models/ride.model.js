const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const rideSchema = new mongoose.Schema({
  user: {
    fullName: {
      type: String,
      required: false,
      trim: true,
    },
    phoneNumber: {
      type: Number,
      required: false,
      trim: true,
    },
    id:{
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    }
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
    distance: {
      type: Number,
      required: true, // Assuming distance is required
    },
    userLatitude: {
      type: Number,
      required: true, // Assuming userLatitude is required
    },
    userLongitude: {
      type: Number,
      required: true, // Assuming userLongitude is required
    },
    destinationLatitude: {
      type: Number,
      required: true, // Assuming destinationLatitude is required
    },
    destinationLongitude: {
      type: Number,
      required: true, // Assuming destinationLongitude is required
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    selectedDate: {
      type: Date, // Assuming selectedDate is a date
      required: true,
    },
    selectedTime: {
      type: String, // Assuming selectedTime is a string
      required: true,
    },
    carSeats: {
      type: Number,
      required: true,
      default: 4, // Static value
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'live'],
      default: 'pending',
    },
  },
  driver: {
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
    isAvailable: {
      type: Boolean,
      default: true,
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
    name: {
      type: String,
      required: false,
      trim: true,
    },
    licenseNumber: {
      type: String,
      required: false,
    },
    driverIdentity: {
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
