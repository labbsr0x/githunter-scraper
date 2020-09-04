const moment = require('moment');

const utils = (() => {
  return {
    dateFormat4StarWS: data => {
      if (!data) {
        return moment(0).format();
      }

      const theDate = moment(data);
      if (!theDate.isValid) {
        return moment(0).format();
      }

      return theDate.format();
    },
    concatArray4StarWS: (data, shortStringLen = 16) => {
      const str = data && Array.isArray(data) ? data.join(',') : '';
      if (!str) {
        return 'no-string';
      }
      return str.substring(0, shortStringLen);
    },
  };
})();

module.exports = utils;
