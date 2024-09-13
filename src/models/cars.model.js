const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const carSchema = mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    colour: {
      type: String,
      required: true,
    },
    make: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
carSchema.plugin(toJSON);
carSchema.plugin(paginate);

const Car = mongoose.model('Car', carSchema);

module.exports = Car;