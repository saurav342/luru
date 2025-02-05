const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
    index: false
  },
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
    type: Date,
    required: [true, 'Booking date and time is required'],
    validate: {
      validator: function(v) {
        return v > new Date();
      },
      message: 'Booking date must be in the future'
    }
  },
  fromLocation: {
    type: String,
    required: [true, 'Pick-up location is required'],
    trim: true
  },
  toLocation: {
    type: String,
    required: [true, 'Drop-off location is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.set('autoIndex', false);

module.exports = mongoose.model('Booking', bookingSchema); 