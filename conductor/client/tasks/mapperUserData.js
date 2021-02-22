const _ = require('lodash');
const logger = require('../../../config/logger');
const contract = require('../../../contract/contract.mapper');

const validate = input => {
  if (!input) return false;

  if (!input.node) return false;

  if (!input[input.node]) return false;

  return true;
};

const task = async (data, updater) => {
  try {
    logger.info(`CONDUCTOR -> Mapper User Data: Start task ${data.taskType}`);

    if (!validate(data.inputData)) {
      throw new Error('Missing input fields.');
    }

    const node = data.inputData.node;
    const dataToMapper = data.inputData[node];

    // Build the response
    const mappedData = {};
    mappedData[node] = dataToMapper.map(item => {
      const mapper = contract[node];
      if (mapper) {
        return mapper({ ...item, node });
      }
      return {};
    });

    const result = {
      outputData: {},
    };

    result.outputData = mappedData;

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
