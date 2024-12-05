const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const carAssignmentSchema = mongoose.Schema(
  {
    car: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Car',
      required: true,
    },
    driver: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Driver',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'assigned', 'unassigned'],
      default: 'pending',
    },
    assignedAt: {
      type: Date,
    },
    unassignedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
carAssignmentSchema.plugin(toJSON);
carAssignmentSchema.plugin(paginate);

const CarAssignment = mongoose.model('CarAssignment', carAssignmentSchema);

module.exports = CarAssignment;
