/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const config = require('config');
const qs = require('qs');

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
  const accessToken = await getValidToken(data.provider);

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

const sendPostToGithunter = async (path, data, body) => {
  const accessToken = await getValidToken(data.provider);

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
    const stringURL = qs.stringify(data);
    const response = await httpClient.post(`${path}?${stringURL}`, body);

    if (response && response.data) {
      return response.data;
    }

    return null;
  } catch (err) {
    console.log(err);

    return null;
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
  const { idsList } = params;
  delete params.idsList;
  return sendPostToGithunter(
    githunterConfig.endpoints.comments,
    params,
    idsList,
  );
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
