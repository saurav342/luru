const mongoose = require('mongoose');

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
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'Empty', 'Scheduled'],
    default: 'pending'
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
}, {
  timestamps: true,
  _id: true  // This is default behavior, MongoDB will auto-generate _id
});

bookingSchema.set('autoIndex', false);

module.exports = mongoose.model('Booking', bookingSchema); 