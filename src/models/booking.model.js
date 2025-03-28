const mongoose = require('mongoose');
const paginate = require('./plugins/paginate.plugin');

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    match: [/^\d{10,}$/, 'Mobile number must have at least 10 digits'],
    index: false
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  dateTime: {
    type: String,
    required: [true, 'Booking date and time is required'],
  },
  fromLocation: {
    type: String,
    // required: [true, 'Pick-up location is required'],
    trim: true
  },
  toLocation: {
    type: String,
    // required: [true, 'Drop-off location is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'scheduled', 'rejected'],
    default: 'pending'
  },
  placesId: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  specialReq: {
    type: String,
    default: '',
  },
  driverName: {
    type: String,
    default: '',
  },
  tripCost: {
    type: Number,
    // required: true,
  },
  cancellationReason: {
    type: String,
    default: '', // Default to an empty string if no reason is provided
  },
  rideId: {
    type: String,
    unique: true, // Ensure that each rideId is unique
    required: true,
  },
  actualCost: {
    type: Number,
    default: 0, // Default to 0 if not specified
  },
  adminComments: {
    type: String,
    default: '', // Default to an empty string if no comments are provided
  },
  isReturnJourney: {
    type: Boolean,
    default: false, // Default to false if not specified
  },
  isAirportPickup: {
    type: Boolean,
    default: false, // Default to false if not specified
  },
  msgToCustomer: {
    type: String,
    enum: ['success', 'fail', 'pending'],
    default: 'pending'
  },
  msgToDriver: {
    type: String,
    enum: ['success', 'fail', 'pending'],
    default: 'pending'
  },
  source: {
    type: String,
    enum: ['go', 'app', 'telegram'],
    default: 'go'
  }
}, {
  timestamps: true,
  _id: true  // This is default behavior, MongoDB will auto-generate _id
});

bookingSchema.plugin(paginate);
bookingSchema.set('autoIndex', false);

module.exports = mongoose.model('Booking', bookingSchema); 