const moment = require('moment');

const utils = (() => {
  return {
    dateFormat4StarWS: (data) => {
      if (!data) {
        return "";
      }

      const theDate = moment(data);
      if (!theDate.isValid) {
        return "";
      }

      return theDate.format();
    },
    concatArray4StarWS: (data, shortStringLen = 8) => {
      const str = data && Array.isArray(data) ? data.join(",") : "";
      if (!str) {
        return data;
      }
      return str.substring(0, shortStringLen);
    },
  };
})();

module.exports = utils;
