const controller = require('../../../controller');

const scraperUsers = async (data, updater) => {
  try {
    console.log(`Start task ${data.taskType} with input:`, data.inputData);

    await controller.run(data.inputData);
    updater.complete({});
  } catch (error) {
    updater.fail({ reasonForIncompletion: error });
  }
};

module.exports = scraperUsers;
