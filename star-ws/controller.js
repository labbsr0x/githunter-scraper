const config = require('config');
const Route = require('route-parser');
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
    console.log(response);
    return response;
  } catch (e) {
    console.log(e);
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
    console.log(response);
    return false;
  } catch (e) {
    console.log(e);
  }
  return false;
};

module.exports = {
  publishMetrics,
  saveJSONData,
};
