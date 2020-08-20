const mongoose = require('mongoose');

const { Schema } = mongoose;

const repoSchema = new Schema(
  {
    name: {
      type: String,
    },
    owner: {
      type: String,
    },
    about: {
      type: String,
    },
    license: {
      type: String,
    },
    url: {
      type: String,
    },
    topics: [String],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('repositoryCollection', repoSchema);
