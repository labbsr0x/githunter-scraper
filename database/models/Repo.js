const mongoose = require('mongoose');
const { Schema } = mongoose;

const language = new Schema({
  name: {
    type: String
  },
  percent: {
    type: String
  }
});

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
  readme: {
    type: String
  },
  watchers: {
    type: Number
  },
  stars: {
    type: Number
  },
  forks: {
    type: Number
  },
  defaultBranch: {
    type: String,
  },
  commitsQuantity: {
    type: Number,
  },
  lastCommitTime: {
    type: Date
  },
  contributorsQuantity: {
    type: Number
  },
  url: {
    type: String
  },
  releases: {
    type: Number
  },
  topics: [String],
  languages: [language]
  //commits
  //issues
}, {timestamps: true});

module.exports = mongoose.model('repoCollection', repoSchema);
