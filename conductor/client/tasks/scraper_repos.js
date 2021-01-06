const logger = require('../../../config/logger');
const controller = require('../../../controller');

const scraperRepos = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> Repo Node: Start task ${data.taskType} with input: %j`,
      data.inputData,
    );

    const outputData = await controller.run(data.inputData);
    updater.complete({ outputData: { sourceData: outputData } }); // the outputData couldn't be an array.
  } catch (error) {
    updater.fail({
      reasonForIncompletion: error.message,
      outputData:
        error.response && error.response.data ? error.response.data : error,
    });
  }
};

module.exports = scraperRepos;
