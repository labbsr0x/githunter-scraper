const moment = require('moment');
const JM = require('json-mapper');
const utils = require('../utils');

const h = JM.helpers;
const shortStringLen = 8;

const code = JM.makeConverter({
  name: 'name',
  description: 'description',
  createdAt: data => utils.dateFormat4StarWS(data.createdAt),
  primaryLanguage: 'primaryLanguage',
  repositoryTopics: data => utils.concatArray4StarWS(data.repositoryTopics),
  watchers: ['watchers', h.toString],
  stars: ['stars', h.toString],
  forks: ['forks', h.toString],
  lastCommitDate: data => utils.dateFormat4StarWS(data.lastCommitDate),
  commits: ['commits', h.toString],
  hasHomepageUrl: 'hasHomepageUrl',
  hasReadmeFile: 'hasReadmeFile',
  hasContributingFile: 'hasContributingFile',
  licenseInfo: 'licenseInfo',
  hasCodeOfConductFile: 'hasCodeOfConductFile',
  releases: ['releases', h.toString],
  contributors: ['contributors', h.toString],
  languages: data => {
    const { totalCount } = data.languages;
    const languages = data.languages.data.map(item => item.name);
    return `totalCount: ${String(totalCount).concat(
      `, languages: ${languages}`,
    )}`;
  },
  diskUsage: ['diskUsage', h.toString],
  provider: 'provider',
  type: JM.helpers.def('codePageInfo'),
});

const pulls = JM.makeConverter({
  dateTime: () => moment().format(),
  fields: {
    number: ['number', h.toString],
    state: 'state',
    createdAt: input => {
      const date = input.createdAt;
      if (!date) return '';

      const theDate = moment(date);
      if (!theDate.isValid) return '';

      return theDate.format();
    },
    closedAt: input => {
      const date = input.closedAt;
      if (!date) return '';

      const theDate = moment(date);
      if (!theDate.isValid) return '';

      return theDate.format();
    },
    merged: ['merged', h.toString],
    mergedAt: input => {
      const date = input.mergedAt;
      if (!date) return '';

      const theDate = moment(date);
      if (!theDate.isValid) return '';

      return theDate.format();
    },
    author: 'author',
    labels: input => {
      const labels = input.labels ? input.labels.join(',') : '';
      return labels.substring(0, shortStringLen);
    },
    totalParticipants: ['participants.totalCount', h.toString],
    participants: input => {
      const participants =
        input.participants && input.participants.users
          ? input.participants.users.join(',')
          : '';
      return participants.substring(0, shortStringLen);
    },
    commentsTotal: ['comments.totalCount', h.toString],
    commentsUpdatedAt: input => {
      const date = input.comments ? input.comments.updatedAt : null;
      if (!date) return '';

      const theDate = moment(date);
      if (!theDate.isValid) return '';

      return theDate.format();
    },
    comments: input => {
      const authors =
        input.comments && input.comments.data
          ? input.comments.data.map(item => item.author).join(',')
          : '';
      return authors.substring(0, shortStringLen);
    },
    dono: 'owner',
    name: 'name',
    provider: 'provider',
    type: JM.helpers.def('pull'),
  },
  tags: {},
});

const issues = JM.makeConverter({
  dateTime: () => moment().format(),
  fields: {
    number: ['number', h.toString],
    state: 'state',
    createdAt: 'createdAt',
    closedAt: 'closedAt',
    updatedAt: 'updatedAt',
    authorLogin: 'authorLogin.author',
    labels: '',
    participantsTotalCount: ['participants.totalCount', h.toString],
    timelineItemsTotalCount: ['timelineItems.totalCount', h.toString],
    timelineUpdatedAt: 'timelineItems.updatedAt',
    timelineItemsNodes: '',
    dono: 'owner',
    name: 'name',
  },
  tags: {},
});

const commits = JM.makeConverter({
  dateTime: () => moment().format(),
  fields: {},
  tags: {},
});

module.exports = {
  code,
  pulls,
  issues,
  commits,
};
