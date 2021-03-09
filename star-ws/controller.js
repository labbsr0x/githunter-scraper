const config = require('config');
const Route = require('route-parser');
const logger = require('../config/logger');
const HttpClient = require('../rest/RESTClient');

const starwsConfig = config.get('star-ws');
const httpClient = new HttpClient({
  url: starwsConfig.urlData,
});

const publishMetrics = async (provider, node, data, createRawData = false) => {
  let endPoint = `${starwsConfig.endpoints.publishMetrics}?createRawData=${createRawData}`;

  const route = new Route(endPoint);
  endPoint = route.reverse({ provider, node });

  try {
    const response = await httpClient.post(endPoint, data);
    logger.debug(`POST Request to save data intro AgroWS successfully!`);
    return response;
  } catch (e) {
    logger.error(`POST Request to save data intro AgroWS: ${e.message}`);
    logger.error(`%j`, e);
    return e;
  }
};

const saveJSONData = async (provider, node, data) => {
  let endPoint = starwsConfig.endpoints.jsonDataAPI;

  const route = new Route(endPoint);
  endPoint = route.reverse({ provider, node });
  
  try {
    const response = await httpClient.post(endPoint, data);
    if (response.status === 200 && response.data && response.data.link) {
      return response.data.link;
    }
    logger.debug(`POST Request to save JSON-data intro AgroWS successfully!`);
    return false;
  } catch (e) {
    logger.error(`POST Request to save JSON-data intro AgroWS: ${e.message}`);
    // throw e;
  }
};

module.exports = {
  publishMetrics,
  saveJSONData,
};
