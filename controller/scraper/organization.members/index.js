const logger = require('../../../config/logger');
const githunterApi = require('../../../githunter-api/controller');

const getMembers = async inputData => {
  try {
    if (
      !inputData ||
      (inputData && !inputData.organization) ||
      (inputData && !inputData.provider)
    ) {
      const msg =
        'CONTROLLER -> Members: No `organization` or `provider` flag defined.';
      logger.info(msg);
      throw new Error(msg);
    }
    const req = {
      provider: inputData.provider,
      organization: inputData.organization,
    };
    const response = await githunterApi.getOrganizationMembers(req);

    if (!response) {
      const msg = `CONTROLLER -> Members: no data found for provider: ${inputData.provider} and organization: ${inputData.organization}`;
      logger.info(msg);
      throw new Error(msg);
    }

    const normalizedMembers = [];
    response.data.forEach(member => {
      normalizedMembers.push({ provider: inputData.provider, login: member });
    });

    return normalizedMembers;
  } catch (err) {
    logger.error(`SCRAPER organization.members: ${err.message}`);
    logger.error(`%j`, err);
    throw err;
  }
};

module.exports = getMembers;
