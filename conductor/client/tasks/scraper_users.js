const logger = require('../../../config/logger');
const controller = require('../../../controller');

const scraperUsers = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> Users Node: Start task ${data.taskType} with input: ${data.inputData}`,
    );

    await controller.run(data.inputData);
    updater.complete({});
  } catch (error) {
    updater.fail({ reasonForIncompletion: error });
  }
};

module.exports = scraperUsers;
