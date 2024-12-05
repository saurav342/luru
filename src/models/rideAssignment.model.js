const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const rideAssignmentSchema = mongoose.Schema(
  {
    ride: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Ride',
      required: true,
    },
    driver: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    acceptedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
rideAssignmentSchema.plugin(toJSON);
rideAssignmentSchema.plugin(paginate);

const RideAssignment = mongoose.model('RideAssignment', rideAssignmentSchema);

module.exports = RideAssignment;
