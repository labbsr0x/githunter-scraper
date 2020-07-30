const mongoose = require('mongoose');
const { Schema } = mongoose;

const repoSchema = new Schema({
  name: {
    type: String
  },
  about: {
    type: String
  },
  license: {
    type: String
  },
  contributorsQuantity: {
    type: Number
  },
  pulls: { 
    open: Number, 
    closed: Number,
    lastPullOpened: Date,
    lastPullClosed: Date,
    list: [
      {
        pullNumber: String,
        openDatetime: Date,
        closedDatetime: Date,
      }
    ]
  }
}, {timestamps: true});

module.exports = mongoose.model('repoCollection', repoSchema);
