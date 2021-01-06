const logger = require('../../../config/logger');
const controller = require('../../../controller');

const scraperReposAllNodes = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> All Nodes: Start task ${data.taskType} with input: with input: %j`,
      data.inputData,
    );

    const outputData = await controller.run(data.inputData.scraperPoint);
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

module.exports = scraperReposAllNodes;
