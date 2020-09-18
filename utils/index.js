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

    prepareString4StarWS: (data, shortStringLen = 250) => {
      if (!data) return data;
      return data.substring(0, shortStringLen);
    },

    concatArray4StarWS: (data, shortStringLen = 250) => {
      const str = data && Array.isArray(data) ? data.join(',') : '';
      if (!str) {
        return 'no-string';
      }
      return str.substring(0, shortStringLen);
    },
    nanoSeconds: () => {
      const hrTime = process.hrtime();
      const nTime = `${hrTime[0] * 1000000000}${hrTime[1]}`;
      const nSec = nTime.substr(nTime.length - 5);
      return moment().format(`YYYY-MM-DDTHH:mm:ss.SSS${nSec}Z`);
    },
  };
})();

module.exports = utils;
