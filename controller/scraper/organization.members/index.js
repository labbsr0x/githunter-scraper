const githunterApi = require('../../../githunter-api/controller');

const getMembers = async flags => {
  if (!flags || (flags && !flags.organization) || (flags && !flags.provider)) {
    console.log('No `organization` or `provider` flag defined.');
    return false;
  }
  const req = { provider: flags.provider, organization: flags.organization };
  const response = await githunterApi.getOrganizationMembers(req);

  if (!response) {
    return false;
  }

  const normalizedMembers = [];
  response.members.data.forEach(member => {
    normalizedMembers.push({ provider: flags.provider, login: member });
  });

  return normalizedMembers;
};

module.exports = getMembers;
