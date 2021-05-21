const _ = require('lodash');
const logger = require('../../../config/logger');
const githunterApi = require('../../../githunter-api/controller');

const nodesSource = {
  pulls: githunterApi.getRepositoryPullsRequest,
  issues: githunterApi.getRepositoryIssues,
  commits: githunterApi.getRepositoryCommits,
  userStats: githunterApi.getUserStats,
  userScore: githunterApi.getUserScore,
  comments: githunterApi.getComments,
  code: githunterApi.getCodePageInformation,
};

const validate = input => {
  if (!input) return false;

  if (!input.node) return false;

  if (!input[input.node]) return false;

  return true;
};

const task = async (data, updater) => {
  try {
    logger.info(
      `CONDUCTOR -> Load Data from GitHunter Data Feed: Start task ${data.taskType}`,
    );

    if (!validate(data.inputData)) {
      throw new Error('Missing input fields.');
    }

    const { node } = data.inputData;
    const listOfRepositories = data.inputData[node];
    const { provider } = data.inputData;
    const bulk = data.inputData.bulk ? data.inputData.bulk : false;

    logger.info('Loading data from githunter-data-feed');
    const rawDataPromise = [];

    if (bulk) {
      _.chunk(listOfRepositories, bulk).map(item => {
        const params = { provider };
        params[node] = item;
        rawDataPromise.push(nodesSource[node](params));
      });
    } else {
      listOfRepositories.forEach((repo, index) => {
        rawDataPromise[index] = nodesSource[node](repo);
      });
    }

    const rawDataValues = await Promise.all(rawDataPromise);

    const fails = [];
    const normalizedData = [];
    rawDataValues.map((d, index) => {
      if (!d || (d.data && d.data.length === 0)) {
        fails.push(listOfRepositories[index]);
        return false;
      }

      // Sometimes the return is not an array
      let arrayData = [];
      if (d.data && Array.isArray(d.data)) {
        arrayData = d.data;
      } else if (!d.data && !Array.isArray(d)) {
        arrayData = [d];
      }

      Object.values(arrayData).forEach(theData => {
        const originalData =
          listOfRepositories[index] === Object(listOfRepositories[index])
            ? { ...listOfRepositories[index] }
            : {};
        normalizedData.push({
          ...theData,
          ...originalData,
          node,
        });
      });
    });

    const result = {
      outputData: {},
    };
    result.outputData[node] = normalizedData;

    if (fails.length > 0) {
      result.outputData.fails = fails;
      // TODO: When back to use LOOP, remove the fail and add the complete.
      result.outputData.done = normalizedData;
      result.reasonForIncompletion = `${fails.length} itens didn't load Data.`;
      // updater.complete(result);
      updater.fail(result);
    }

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
