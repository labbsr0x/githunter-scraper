const logger = require('../../../config/logger');
const controller = require('../../../controller');

const scraperReposAllNodes = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> All Nodes: Start task ${data.taskType} with input: ${data.inputData}`,
    );

    const outputData = await controller.run(data.inputData.scraperPoint);
    updater.complete({ outputData });
  } catch (error) {
    updater.fail({ reasonForIncompletion: error });
  }
};

module.exports = scraperReposAllNodes;
