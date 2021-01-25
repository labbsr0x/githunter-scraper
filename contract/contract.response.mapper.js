const JM = require('json-mapper');

const issues = JM.makeConverter({
  comments: input => {
    if (input && input.comments && input.comments.data) {
      return input.comments.data.map(v => v.id);
    }
    return [];
  },
  provider: 'provider',
  type: 'node',
});

const pulls = JM.makeConverter({
  comments: input => {
    if (input && input.comments && input.comments.data) {
      return input.comments.data.map(v => v.id);
    }
    return [];
  },
  provider: 'provider',
  type: 'node',
});

const userStats = JM.makeConverter({
  repositories: 'contributedRepositories',
  provider: 'provider',
  type: 'node',
});

module.exports = {
  issues,
  pulls,
  userStats,
};
