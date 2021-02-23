const { update } = require('lodash');
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
      `CONDUCTOR -> Save JSON Data in StarWS: Start task ${data.taskType}.`,
    );

    if (!validate(data.inputData)) {
      throw new Error('Missing input fields.');
    }

    let dataToBeSaved;
    let isRetry = false;
    const fails = [];
    const node = data.inputData.node;
    const listOfRepositories = data.inputData[node];

    if (data.inputData.fails && data.inputData.fails.length) {
      dataToBeSaved = data.inputData.fails;
      data.inputData[node] = data.inputData.done;
      isRetry = true;
    } else {
      dataToBeSaved = listOfRepositories;
    }

    // Save JSON Data
    const rawDataPromise = [];
    dataToBeSaved.forEach((theData, index) => {
      rawDataPromise[index] = starws.saveJSONData(theData);
    });

    const rawDataValues = await Promise.all(rawDataPromise);

    const normalizedData = [];
    dataToBeSaved.forEach((theData, index) => {
      const rawData = rawDataValues[index];
      if (rawData) {
        normalizedData.push({
          ...theData,
          rawData,
          node,
        });
      } else {
        fails.push(theData);
      }
    });

    const result = {
      outputData: {},
    };
    result.outputData[node] = normalizedData;
    if (isRetry) {
      // Merge the previous success itens with new attempt success itens
      result.outputData[node] = [...data.inputData[node], ...normalizedData];
    }

    if (fails.length > 0) {
      result.outputData.fails = fails;
      result.outputData.done = normalizedData;
      result.reasonForIncompletion = `${fails.length}/${listOfRepositories.length} itens didn't generate JSON Data.`;
      // TODO: When back to use LOOP, remove the fail and add the complete.
      //updater.complete(result);
      updater.fail(result);
      return;
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
