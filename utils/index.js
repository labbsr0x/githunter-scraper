const moment = require('moment');
const logger = require('../config/logger');

const utils = (() => {
  return {
    dateCounter: 0,
    dateFormat4StarWS: data => {
      if (!data) {
        logger.debug(`UTILS dateFormat4StarWS: Date content is invalid!`);
        return moment(0).format();
      }

      const theDate = moment(data);
      if (!theDate.isValid) {
        logger.debug(
          `UTILS dateFormat4StarWS: Date format to StarWS is invalid, return default!`,
        );
        return moment(0).format();
      }

      logger.debug(
        `UTILS dateFormat4StarWS: Formatted data to StarWS successfully!`,
      );
      return theDate.format();
    },

    prepareString4StarWS: (data, shortStringLen = 250) => {
      if (!data) {
        logger.debug(`UTILS prepareString4StarWS: String content is invalid!`);
        return data;
      }

      const d = data.substring(0, shortStringLen);
      logger.debug(`UTILS prepareString4StarWS: ${data} -> ${d}`);
      return d;
    },

    concatArray4StarWS: (data, shortStringLen = 250) => {
      const str = data && Array.isArray(data) ? data.join(',') : '';
      if (!str) {
        logger.debug(
          `UTILS concatArray4StarWS: Array or array content is invalid!`,
        );
        return 'no-string';
      }

      logger.debug(
        `UTILS concatArray4StarWS: Array concatenated to StarWS successfully!`,
      );
      return str.substring(0, shortStringLen);
    },
    nanoSeconds: () => {
      const nSec = `${utils.dateCounter}`.padStart(3, '0');
      utils.dateCounter += 1;
      const d = moment().format(`YYYY-MM-DDTHH:mm:ss.SSS${nSec}Z`);
      logger.debug(`UTIL nanoSeconds: ${d}`);
      return d;
    },
  };
})();

module.exports = utils;
