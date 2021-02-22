const _ = require('lodash');
const logger = require('../../../config/logger');
const { code } = require('../../../contract/contract.mapper');

const validate = input => {
  if (!input) return false;

  if (!input.node) return false;

  if (!input[input.node]) return false;

  return true;
};

const task = async (data, updater) => {
  try {
    logger.info(`CONDUCTOR -> Format User Data: Start task ${data.taskType}`);

    if (!validate(data.inputData)) {
      throw new Error('Missing input fields.');
    }

    const node = data.inputData.node;
    const provider = data.inputData.provider;
    const dataToMapper = data.inputData[node];

    // Build the response
    let pulls = [];
    let issues = [];
    let commits = [];
    let code = [];
    dataToMapper.map(item => {
      pulls = pulls.concat(item.pulls);
      issues = issues.concat(item.issues);
      commits = commits.concat(item.ownedRepositories);
      code = code.concat(item.contributedRepositories);
    });

    pulls.map(item => {
      if (!item.provider) item.provider = provider;
    });

    issues.map(item => {
      if (!item.provider) item.provider = provider;
    });

    commits.map(item => {
      if (!item.provider) item.provider = provider;
    });

    code.map(item => {
      if (!item.provider) item.provider = provider;
    });

    const result = {
      outputData: { pulls, issues, commits, code },
    };

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
