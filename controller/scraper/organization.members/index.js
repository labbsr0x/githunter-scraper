const githunterApi = require('../../../githunter-api/controller');

const getMembers = async inputData => {
  if (
    !inputData ||
    (inputData && !inputData.organization) ||
    (inputData && !inputData.provider)
  ) {
    console.log('No `organization` or `provider` flag defined.');
    return false;
  }
  const req = {
    provider: inputData.provider,
    organization: inputData.organization,
  };
  const response = await githunterApi.getOrganizationMembers(req);

  if (!response) {
    return false;
  }

  const normalizedMembers = [];
  response.members.data.forEach(member => {
    normalizedMembers.push({ provider: inputData.provider, login: member });
  });

  return normalizedMembers;
};

module.exports = getMembers;
