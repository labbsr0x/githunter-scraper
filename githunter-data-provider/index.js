const config = require('config');
const logger = require('../config/logger');
const HttpClient = require('../rest/RESTClient');

const configFeed = config.get('githunter-data-provider');
const httpClient = new HttpClient({
  url: configFeed.url,
});

const saveCodeInfo = async data => {
  try {
    const response = await httpClient.post(configFeed.endpoints.codeInfo, data);

    if (response && response.data) {
      logger.debug(`POST Request to Save Code successfully!`);
      return response.data;
    }

    return null;
  } catch (err) {
    logger.error(`POST Request to Save Code: ${err.message}`);
    throw err;
  }
};

const saveUserData = async data => {
  try {
    const response = await httpClient.post(
      configFeed.endpoints.userScore,
      data,
    );

    if (response && response.data) {
      logger.debug(`POST Request to Save User successfully!`);
      return response.data;
    }

    return null;
  } catch (err) {
    logger.error(`POST Request to Save User: ${err.message}`);
    throw err;
  }
};

module.exports = {
  saveCodeInfo,
  saveUserData,
};
