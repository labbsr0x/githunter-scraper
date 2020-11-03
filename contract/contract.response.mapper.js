const JM = require('json-mapper');

const issues = JM.makeConverter({
  ids: input => {
    if (input && input.comments && input.comments.data) {
      return input.comments.data.map(v => v.id);
    }
    return [];
  },
});

const pulls = JM.makeConverter({
  ids: input => {
    if (input && input.comments && input.comments.data) {
      return input.comments.data.map(v => v.id);
    }
    return [];
  },
});

module.exports = {
  issues,
  pulls,
};
