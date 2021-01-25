const _ = require('lodash');
const logger = require('../../../config/logger');
const contractResponse = require('../../../contract/contract.response.mapper');

const validate = input => {
  if (!input) return false;

  if (!input.node) return false;

  if (!input[input.node]) return false;

  return true;
};

const task = async (data, updater) => {
  try {
    logger.info(`CONDUCTOR -> Mapper Output: Start task ${data.taskType}`);

    if (!validate(data.inputData)) {
      throw new Error('Missing input fields.');
    }

    const node = data.inputData.node;
    const dataToMapper = data.inputData[node];

    // Build the response
    const mappedData = {};
    const mappedObj = [];
    dataToMapper.forEach(node => {
      mappedData[node] = data[node].map(item => {
        const mapper = contractResponse[node];
        if (mapper) {
          return mapper({ ...item, node });
        }
        return {};
      });

      // Transform an array of object in object of array grouping by keys
      const mergedObj = {};
      mappedData[node].map(item => {
        Object.keys(item).map(val => {
          mergedObj[val] =
            mergedObj[val] && mergedObj[val].length > 0
              ? _.concat(mergedObj[val], item[val])
              : item[val];
          return val;
        });
        return item;
      });

      // Removing empty values and duplicated values (if array has one item, remove from array)
      Object.keys(mergedObj).map(key => {
        mergedObj[key] = _.compact(mergedObj[key]);
        mergedObj[key] = _.uniqBy(mergedObj[key]);
        if (Array.isArray(mergedObj[key]) && mergedObj[key].length === 1) {
          // eslint-disable-next-line prefer-destructuring
          mergedObj[key] = mergedObj[key][0];
        }
        return key;
      });

      mappedObj.push(mergedObj);
    });

    const result = {
      outputData: {},
    };

    result.outputData = mappedObj;

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
