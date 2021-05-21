const logger = require('../../../config/logger');
const githunterDataProvider = require('../../../githunter-data-provider');
const contract = require('../../../contract/contract.mapper');

const mongoSource = {
  code: githunterDataProvider.saveCodeInfo,
  user: githunterDataProvider.saveUserData,
};

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

    const { node } = data.inputData;
    const listOfRepositories = data.inputData[node];

    const maker = contract[node];

    listOfRepositories.map((data, index) => {
      if (!data) return;
      const normalizedData = maker({
        ...data,
      });
      mongoSource[node](normalizedData); // TODO: Add it in array to Promise.all
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
