const moment = require('moment');
const JM = require('json-mapper');
const utils = require('../utils');

const h = JM.helpers;
const shortStringLen = 16;

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

const pulls = JM.makeConverter({
  dateTime: () => moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
  fields: {
    number: ['number', h.toString],
    state: 'state',
    createdAt: input => utils.dateFormat4StarWS(input.createdAt),
    closedAt: input => utils.dateFormat4StarWS(input.closedAt),
    merged: ['merged', h.toString],
    mergedAt: input => utils.dateFormat4StarWS(input.mergedAt),
    author: input => {
      return `a:${input.author.substring(0, shortStringLen)}`;
    },
    labels: input => utils.concatArray4StarWS(input.labels),
    totalParticipants: ['participants.totalCount', h.toString],
    participants: input => {
      const participants =
        input.participants && input.participants.users
          ? utils.concatArray4StarWS(input.participants.users)
          : '';
      return `p:${participants}`;
    },
    commentsTotal: ['comments.totalCount', h.toString],
    commentsUpdatedAt: input =>
      utils.dateFormat4StarWS(input.comments.updatedAt),
    comments: input => {
      const authors =
        input.comments && input.comments.data
          ? input.comments.data.map(item => item.author).join(',')
          : '';
      return `a:${authors.substring(0, shortStringLen)}`;
    },
    dono: input => {
      return `o:${input.owner.substring(0, shortStringLen)}`;
    },
    name: input => {
      return `n:${input.name.substring(0, shortStringLen)}`;
    },
    provider: 'provider',
    type: JM.helpers.def('pull'),
  },
  tags: {},
});

const issues = JM.makeConverter({
  dateTime: () => moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
  fields: {
    number: ['number', h.toString],
    state: 'state',
    createdAt: input => utils.dateFormat4StarWS(input.createdAt),
    closedAt: input => utils.dateFormat4StarWS(input.closedAt),
    updatedAt: input => utils.dateFormat4StarWS(input.updatedAt),
    author: 'author',
    labels: input => utils.concatArray4StarWS(input.labels),
    participantsTotalCount: ['participants.totalCount', h.toString],
    participants: input => {
      const participants =
        input.participants && input.participants.users
          ? utils.concatArray4StarWS(input.participants.users)
          : '';
      return `p:${participants}`;
    },
    commentsTotalCount: ['comments.totalCount', h.toString],
    commentsUpdatedAt: input =>
      utils.dateFormat4StarWS(input.comments.updatedAt),
    comments: input => {
      const authors =
        input.comments && input.comments.data
          ? input.comments.data.map(item => item.author).join(',')
          : '';
      return `a:${authors.substring(0, shortStringLen)}`;
    },
    dono: input => {
      return `o:${input.owner.substring(0, shortStringLen)}`;
    },
    name: input => {
      return `n:${input.name.substring(0, shortStringLen)}`;
    },
    provider: 'provider',
    type: JM.helpers.def('issues'),
  },
  tags: {},
});

const commits = JM.makeConverter({
  dateTime: () => moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
  fields: {
    message: input => {
      return `m:${input.message.substring(0, shortStringLen)}`;
    },
    committedDate: data => utils.dateFormat4StarWS(data.committedDate),
    author: input => {
      return `a:${input.author.substring(0, shortStringLen)}`;
    },
    dono: input => {
      return `o:${input.owner.substring(0, shortStringLen)}`;
    },
    name: input => {
      return `n:${input.name.substring(0, shortStringLen)}`;
    },
    provider: 'provider',
    type: JM.helpers.def('commits'),
  },
  tags: {},
});

const userStats = JM.makeConverter({
  dateTime: () => moment().format('YYYY-MM-DDTHH:mm:ss.SSSSZ'),
  fields: {
    name: input => {
      return `n:${input.login.substring(0, shortStringLen)}`;
    },
    login: input => {
      return `l:${input.login.substring(0, shortStringLen)}`;
    },
    avatarUrl: 'avatarUrl',
    contributedRepositories: ['amount.contributedRepositories', h.toString],
    commits: ['amount.commits', h.toString],
    pullRequests: ['amount.pullRequests', h.toString],
    issuesOpened: ['amount.issuesOpened', h.toString],
    starsReceived: ['amount.starsReceived', h.toString],
    followers: ['amount.followers', h.toString],
    provider: 'provider',
    type: JM.helpers.def('userStats'),
  },
  tags: {},
});

module.exports = {
  code,
  pulls,
  issues,
  commits,
  userStats,
};
