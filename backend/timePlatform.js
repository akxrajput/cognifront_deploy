const mongoose = require('mongoose');

// Define the schema for the Platform model
const platformSchema = new mongoose.Schema({
  options: {
    whatsapp: Boolean,
    telegram: Boolean,
    both: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the Platform model
const Platform = mongoose.model('Platform', platformSchema);

module.exports = Platform;
