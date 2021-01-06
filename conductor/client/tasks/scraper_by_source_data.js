const logger = require('../../../config/logger');
const controller = require('../../../controller');

const sourcedRepos = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> Sourced Data: Start task ${data.taskType} with input: %j`,
      data.inputData,
    );

    const outputData = await controller.run(data.inputData);
    updater.complete({ outputData: { sourceData: outputData } });
  } catch (error) {
    updater.fail({ reasonForIncompletion: error.message, outputData: error });
  }
};

module.exports = sourcedRepos;
