const { isArray } = require('lodash');
const logger = require('../../../config/logger');
const controller = require('../../../controller');

const scraperComments = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> Scraper Comments: Start task ${data.taskType} with input: %j`,
      data.inputData,
    );

    if (!data.inputData) {
      throw new Error('Missing inputData');
    }

    // Check if ids is an array (if not trasform it)
    data.inputData.sourceData.forEach(item => {
      if (!isArray(item.ids)) {
        item.ids = [item.ids];
      }
    });

    const outputData = await controller.run({
      sourceData: data.inputData.sourceData,
      nodes: data.inputData.nodes,
    });

    updater.complete({ outputData: { sourceData: outputData } });
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

module.exports = scraperComments;
