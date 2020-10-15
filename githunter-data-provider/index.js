const config = require('config');
const HttpClient = require('../rest/RESTClient');

const configFeed = config.get('githunter-data-provider');
const httpClient = new HttpClient({
  url: configFeed.url,
});

const saveCodeInfo = async data => {
  try {
    const response = await httpClient.post(configFeed.endpoints.codeInfo, data);

    if (response && response.data) {
      return response.data;
    }

    return null;
  } catch (err) {
    console.log(err);

    return null;
  }
};

module.exports = {
  saveCodeInfo,
};
