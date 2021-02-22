const JM = require('json-mapper');

const h = JM.helpers;

const code = JM.makeConverter({
  name: 'name',
  owner: 'owner',
  description: 'description',
  repoCreatedAt: 'createdAt',
  primaryLanguage: 'primaryLanguage',
  repositoryTopics: 'repositoryTopics',
  watchers: ['watchers', h.toString],
  stars: ['stars', h.toString],
  forks: ['forks', h.toString],
  lastCommitDate: 'lastCommitDate',
  commits: ['commits', h.toString],
  hasHomepageUrl: 'hasHomepageUrl',
  hasReadmeFile: 'hasReadmeFile',
  readmeFileSize: 'readmeFileSize',
  hasContributingFile: 'hasContributingFile',
  licenseInfo: 'licenseInfo',
  hasCodeOfConductFile: 'hasCodeOfConductFile',
  releases: ['releases', h.toString],
  contributors: ['contributors', h.toString],
  languages: data => {
    const languages = data.languages.data.map(item => item.name);
    return languages;
  },
  diskUsage: ['diskUsage', h.toString],
  provider: 'provider',
  type: JM.helpers.def('codePageInfo'),
});

const user = JM.makeConverter({
  name: 'name',
  login: 'login',
  provider: 'provider',
  avatarUrl: 'avatarUrl',
  company: 'company',
  organizations: 'organizations',
  followers: 'followers',
  ownedRepositories: 'ownedRepositories',
});

module.exports = {
  code,
  user,
};
