/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const config = require('config');
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
      return response.data.resources.graphql;
    }

    return null;
  } catch (err) {
    console.log(err);

    return null;
  }
};

const getValidToken = async () => {
  const gitHunterConfig = config.get('githunter');
  const personalTokenList = gitHunterConfig.rateLimit.personalToken;

  for (const token of personalTokenList) {
    const limits = await hasRateLimit(token);
    if (limits && limits.remaining > gitHunterConfig.rateLimit.minLimit) {
      return token;
    }
  }

  return null;
};

const sendGetToGithunter = async (path, data) => {
  const accessToken = await getValidToken();

  if (!accessToken) {
    console.error('No token available for consume githunter API.');
    return null;
  }

  try {
    httpClient.addAccessToken(accessToken);
    data = {
      ...data,
      access_token: accessToken,
    };
    const response = await httpClient.get(path, data);

    if (response && response.data) {
      return response.data;
    }

    return null;
  } catch (err) {
    console.log(err);

    return null;
  }
};

const getRepositoryInformation = async params => {
  return sendGetToGithunter(githunterConfig.endpoints.repository, params);
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

module.exports = {
  getRepositoryInformation,
  getRepositoryCommits,
  getRepositoryPullsRequest,
  getRepositoryIssues,
};
