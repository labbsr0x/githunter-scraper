const logger = require('../../../config/logger');
const starws = require('../../../star-ws/controller');

const validate = input => {
  if (!input) return false;

  if (!input.node) return false;

  if (!input[input.node]) return false;

  return true;
};

const task = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> Save Data in StarWS: Start task ${data.taskType} with input: %j`,
      data.inputData,
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
    dataToBeSaved.map(item => providers.set(item.provider, 1));

    providers.forEach((v, theProvider) => {
      const providerData = dataToBeSaved.filter(
        item => item.provider === theProvider,
      );
      if (dataToBeSaved && dataToBeSaved.length > 0)
        promissePublish.push(
          starws.publishMetrics(theProvider, node, providerData),
        );
    });
    const endPromisse = await Promise.all(promissePublish);
    const errorRequest = endPromisse.filter((resp, index) => {
      if (resp && resp.status && resp.status !== 201) {
        fails.push(dataToBeSaved[index]);
        return true;
      }
      return false;
    });

    const result = {
      outputData: {},
    };

    if (errorRequest && errorRequest.length > 0) {
      result.outputData.fails = fails;
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
