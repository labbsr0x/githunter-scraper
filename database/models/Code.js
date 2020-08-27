const mongoose = require('mongoose');

const { Schema } = mongoose;

const codeInfoSchema = new Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    createdAt: {
      type: String,
    },
    primaryLanguage: {
      type: String,
    },
    repositoryTopics: [String],
    watchers: {
      type: Number,
    },
    stars: {
      type: Number,
    },
    forks: {
      type: Number,
    },
    lastCommitDate: {
      type: String,
    },
    commits: {
      type: Number,
    },
    hasHomepageUrl: {
      type: Boolean,
    },
    hasReadmeFile: {
      type: Boolean,
    },
    hasContributingFile: {
      type: Boolean,
    },
    licenseInfo: {
      type: String,
    },
    hasCodeOfConductFile: {
      type: Boolean,
    },
    releases: {
      type: Number,
    },
    contributors: {
      type: Number,
    },
    languages: {
      type: (Number, [String]),
    },
    diskUsage: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('codeInfoCollection', codeInfoSchema);
