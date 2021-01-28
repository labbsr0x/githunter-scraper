const logger = require('../../../config/logger');
const githunterApi = require('../../../githunter-api/controller');
const contract = require('../../../contract/contract.mapper');

const validate = input => {
  if (!input) return false;

  if (!input.node) return false;

  if (!input[input.node]) return false;

  return true;
};

const task = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> Load Data from GitHunter Data Feed: Start task ${data.taskType}`,
    );

    if (!validate(data.inputData)) {
      throw new Error('Missing input fields.');
    }

    const node = data.inputData.node;
    const listOfRepositories = data.inputData[node];

    const maker = contract.code;

    const rawDataPromise = [];
    listOfRepositories.forEach((theData, index) => {
      rawDataPromise.push(githunterApi.getCodePageInformation(theData));
    });

    const rawDataValues = await Promise.all(rawDataPromise);

    rawDataValues.map((data, index) => {
      if (!data) return;
      const normalizedData = maker({
        ...data,
        ...listOfRepositories[index],
      });
      githunterDataProvider.saveCodeInfo(normalizedData); //TODO: Add it in array to Promise.all
    });

    const result = {};

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
