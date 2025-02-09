const mongoose = require('mongoose');

const gupshupSchema = new mongoose.Schema({
    profileName: {
        type: String,
        required: true
    },
    waId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Gupshup', gupshupSchema); 