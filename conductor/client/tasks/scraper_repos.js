const logger = require('../../../config/logger');
const controller = require('../../../controller');

const scraperRepos = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> Repo Node: Start task ${data.taskType} with input: ${data.inputData}`,
    );

    const outputData = await controller.run(data.inputData);
    updater.complete({ outputData });
  } catch (error) {
    updater.fail({ reasonForIncompletion: error });
  }
};

module.exports = scraperRepos;
