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
  }
}, {timestamps: true});

module.exports = mongoose.model('repoCollection', repoSchema);
