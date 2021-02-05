const logger = require('../../../config/logger');
const starws = require('../../../star-ws/controller');
const utils = require('../../../utils');

const validate = input => {
  if (!input) return false;

  if (!input.node) return false;

  if (!input[input.node]) return false;

  return true;
};

const task = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> Save Data in StarWS: Start task ${data.taskType}`,
    );

    if (!validate(data.inputData)) {
      throw new Error('Missing input fields.');
    }

    const node = data.inputData.node;
    let dataToBeSaved = data.inputData[node];
    const fails = [];

    if (data.inputData.fails && data.inputData.fails.length) {
      dataToBeSaved = data.inputData.fails;
    }

    logger.info('Save data in StarWS');
    const promissePublish = [];
    const providers = new Map();
    dataToBeSaved.map(item => {
      return node === 'userStats'
        ? providers.set(`${item.provider}_${item.login}`, 1)
        : providers.set(`${item.owner}_${item.name}`, 1);
    });

    providers.forEach((v, theProvider) => {
      const providerData = dataToBeSaved.filter(item => {
        item.dateTime = utils.dateFormat4StarWS(new Date().toISOString());
        return node === 'userStats'
          ? `${item.provider}_${item.login}` === theProvider
          : `${item.owner}_${item.name}` === theProvider;
      });
      if (dataToBeSaved && dataToBeSaved.length > 0)
        promissePublish.push(
          starws.publishMetrics(theProvider, node, providerData),
        );
    });

    const failsResponse = [];
    const endPromisse = await Promise.all(promissePublish);
    const errorRequest = endPromisse.filter((resp, index) => {
      if (
        (resp && resp.status && resp.status === 201) ||
        (resp && resp.status && resp.status === 409)
      ) {
        return false;
      }
      fails.push(dataToBeSaved[index]);
      const r = {};
      r.status =
        resp && resp.response && resp.response.status
          ? resp.response.status
          : 501;
      r.statusText =
        resp && resp.response && resp.response.statusText
          ? resp.response.statusText
          : 'Unknown';
      r.message =
        resp && resp.response && resp.response.data && resp.response.data.message
          ? resp.response.data.message
          : 'Unknown';
      failsResponse.push(r);
      return true;
    });

    const result = {
      outputData: {},
    };

    if (errorRequest && errorRequest.length > 0) {
      result.outputData.fails = fails;
      result.outputData.failsResponse = failsResponse;
    }

    updater.complete(result);
  } catch (error) {
    updater.fail({
      reasonForIncompletion:
        error && error.message ? error.message : 'Unknown error.',
      outputData:
        error && error.response && error.response.data
          ? error.response.data
          : error,
    });
  }
};

module.exports = task;
