const logger = require('../../../config/logger');

const validate = input => {
  if (!input) return false;

  if (!input.scraperPoint) return false;

  if (!input.node) return false;

  return true;
};

const task = async (data, updater) => {
  try {
    logger.info(`CONDUCTOR -> Crawler: Start task ${data.taskType}`);

    if (!validate(data.inputData)) {
      throw new Error('Missing input fields.');
    }

    logger.info(
      `Getting list of source data in scraper point ${data.inputData.scraperPoint}`,
    );

    const { provider, organization, scraperPoint, node } = data.inputData || {};

    // eslint-disable-next-line global-require
    const scraperMode = require(`../../../controller/scraper/${scraperPoint}`);
    const outputData = await scraperMode({ provider, organization });

    const result = {
      outputData: {},
    };
    result.outputData[node] = outputData;

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
