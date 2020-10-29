const config = require('config');
const Route = require('route-parser');
const logger = require('../config/logger');
const HttpClient = require('../rest/RESTClient');

const starwsConfig = config.get('star-ws');
const httpClient = new HttpClient({
  url: starwsConfig.urlData,
});

const publishMetrics = async (provider, node, data) => {
  let endPoint = starwsConfig.endpoints.publishMetrics;

  const route = new Route(endPoint);
  endPoint = route.reverse({ provider, node });

  try {
    const response = await httpClient.post(endPoint, data);
    logger.info(`POST Request to save data intro AgroWS successfully!`);
    return response;
  } catch (e) {
    logger.error(`POST Request to save data intro AgroWS failure!\n${e}`);
  }
  return false;
};

const saveJSONData = async data => {
  const endPoint = starwsConfig.endpoints.jsonDataAPI;
  try {
    const response = await httpClient.post(endPoint, data);
    if (response.status === 200 && response.data && response.data.link) {
      return response.data.link;
    }
    logger.info(`POST Request to save JSON-data intro AgroWS successfully!`);
    return false;
  } catch (e) {
    logger.error(`POST Request to save JSON-data intro AgroWS failure!\n${e}`);
  }
  return false;
};

module.exports = {
  publishMetrics,
  saveJSONData,
};
