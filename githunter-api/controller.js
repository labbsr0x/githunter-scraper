/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const config = require('config');
const qs = require('qs');
const logger = require('../config/logger');

const HttpClient = require('../rest/RESTClient');

const githunterConfig = config.get('githunter');
const httpClient = new HttpClient({
  url: githunterConfig.url,
});

const hasRateLimit = async accessToken => {
  const gitHubConfig = config.get('github');

  const httpClientGithub = new HttpClient({
    url: gitHubConfig.url,
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
    accessToken,
  });

  try {
    const response = await httpClientGithub.get(gitHubConfig.rateLimitPath);

    if (response && response.data && response.data.resources) {
      logger.debug(
        `GET Request to Githunter-API ratelimit from Github successfully!`,
      );
      return response.data.resources.graphql;
    }

    return null;
  } catch (err) {
    logger.error(
      `GET Request to Githunter-API ratelimit from Github failure!: %j`,
      err,
    );
    throw err;
  }
};

const getValidToken4Github = async () => {
  const gitHunterConfig = config.get('githunter');
  const personalTokenList = gitHunterConfig.github.rateLimit.personalToken;

  for (const token of personalTokenList) {
    const limits = await hasRateLimit(token);
    if (
      limits &&
      limits.remaining > gitHunterConfig.github.rateLimit.minLimit
    ) {
      return token;
    }
  }
  return null;
};

const getValidToken4Gitlab = () => {
  const gitHunterConfig = config.get('githunter');
  const personalTokenList = gitHunterConfig.gitlab.rateLimit.personalToken;
  const index = Math.floor(Math.random() * personalTokenList.length);
  return personalTokenList[index];
};

const getValidToken = async provider => {
  switch (provider) {
    case 'github': {
      const token = await getValidToken4Github();
      return token;
    }
    case 'gitlab': {
      return getValidToken4Gitlab();
    }
    default:
      break;
  }
  return null;
};

const sendGetToGithunter = async (path, data) => {
  try {
    const accessToken = await getValidToken(data.provider);

    if (!accessToken) {
      const msg =
        'Githunter-API: No token available for consume (GET) githunter API.';
      logger.error(msg);
      throw new Error(msg);
    }

    httpClient.addAccessToken(accessToken);
    data = {
      ...data,
      access_token: accessToken,
    };
    const response = await httpClient.get(path, data);

    if (response && response.data) {
      logger.debug(`GET Request to Githunter-API with token is valid!`);
      return response.data;
    }

    return null;
  } catch (err) {
    logger.debug(`GET Request to Githunter-API: ${err.message}`);
    logger.debug(`%j`, err);
    throw err;
  }
};

const sendPostToGithunter = async (path, data, body) => {
  try {
    const accessToken = await getValidToken(data.provider);

    if (!accessToken) {
      const msg =
        'Githunter-API: No token available for consume (POST) githunter API.';
      logger.error(msg);
      throw new Error(msg);
    }

    httpClient.addAccessToken(accessToken);
    data = {
      ...data,
      access_token: accessToken,
    };
    const stringURL = qs.stringify(data);
    const response = await httpClient.post(`${path}?${stringURL}`, body);

    if (response && response.data) {
      return response.data;
    }

    return null;
  } catch (err) {
    logger.debug(`POST Request to Githunter-API: ${err.message}`);
    logger.debug(`%j`, err);
    throw err;
  }
};

const getCodePageInformation = async params => {
  return sendGetToGithunter(githunterConfig.endpoints.codePageInfo, params);
};

const getRepositoryCommits = async params => {
  return sendGetToGithunter(githunterConfig.endpoints.commits, params);
};

const getRepositoryPullsRequest = async params => {
  return sendGetToGithunter(githunterConfig.endpoints.pulls, params);
};

const getRepositoryIssues = async params => {
  return sendGetToGithunter(githunterConfig.endpoints.issues, params);
};

const getOrganizationMembers = async params => {
  return sendGetToGithunter(
    githunterConfig.endpoints.organizationMembers,
    params,
  );
};

const getUserStats = async params => {
  return sendGetToGithunter(githunterConfig.endpoints.userStats, params);
};

const getComments = async params => {
  const { comments } = params;
  delete params.comments;
  return sendPostToGithunter(githunterConfig.endpoints.comments, params, {
    ids: comments,
  });
};

module.exports = {
  getCodePageInformation,
  getRepositoryCommits,
  getRepositoryPullsRequest,
  getRepositoryIssues,
  getOrganizationMembers,
  getUserStats,
  getComments,
};
