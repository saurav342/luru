const mongoose = require('mongoose');

const rideIdCounterSchema = new mongoose.Schema({
  sequenceValue: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('RideIdCounter', rideIdCounterSchema); 