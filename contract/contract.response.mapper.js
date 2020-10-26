const JM = require('json-mapper');

const issues = JM.makeConverter({
  ids: input => {
    if (input) {
      return input.comments.data.map(v => v.id);
    }
    return [];
  },
});

module.exports = {
  issues,
};
