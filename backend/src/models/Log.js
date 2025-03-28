const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  action: {
    type: String,
    required: true
  },
  endpoint: {
    type: String
  },
  method: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Number
  },
  details: {
    type: Object
  }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
