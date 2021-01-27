const _ = require('lodash');
const githunterApi = require('../githunter-api/controller');
const githunterDataProvider = require('../githunter-data-provider');
const starws = require('../star-ws/controller');
const contract = require('../contract/contract.mapper');
const logger = require('../config/logger');
const contractResponse = require('../contract/contract.response.mapper');

const nodesSource = {
  pulls: githunterApi.getRepositoryPullsRequest,
  issues: githunterApi.getRepositoryIssues,
  commits: githunterApi.getRepositoryCommits,
  userStats: githunterApi.getUserStats,
  comments: githunterApi.getComments,
};

const readCodePageInformation = async repo => {
  const maker = contract.code;
  const data = await githunterApi.getCodePageInformation(repo);
  if (!data) return;
  const normalizedData = maker({
    ...data,
    ...repo,
  });

  await githunterDataProvider.saveCodeInfo(normalizedData);
};

const readInformation = async (node, sourceData) => {
  const normalizedData = [];
  const response = await nodesSource[node](sourceData);
  if (!response || (response.data && response.data.length === 0))
    return normalizedData;

  // Sometimes the return is not an array
  let arrayData = [];
  if (response.data && Array.isArray(response.data)) {
    arrayData = response.data;
  } else if (!response.data && !Array.isArray(response)) {
    arrayData = [response];
  }

  Object.values(arrayData).forEach(theData => {
    normalizedData.push({
      ...theData,
      ...sourceData,
      node,
    });
  });

  return normalizedData;
};

const loadDataFromGithunterAPI = async (sourceData, nodes) => {
  const normalizedData = {};
  // console.log(`START ton of request: ${moment().format()}`);
  const promises = sourceData.map(async data => {
    if (!nodes || (nodes && nodes.includes('code'))) {
      try {
        await readCodePageInformation(data);
      } catch (e) {
        logger.error(`%j`, e);
        throw e;
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const node of Object.keys(nodesSource)) {
      if (!nodes || (nodes && nodes.includes(node))) {
        if (!normalizedData[node]) normalizedData[node] = [];
        try {
          // eslint-disable-next-line no-await-in-loop
          const info = await readInformation(node, data);
          if (info && info.length > 0) {
            normalizedData[node] = normalizedData[node].concat(info);
          }
        } catch (e) {
          logger.error(`%j`, e);
          throw e;
        }
      }
    }
  });

  await Promise.all(promises);

  // console.log(`END ton request: ${moment().format()}`);
  return normalizedData;
};

const saveStarWS = async data => {
  const promissePublish = [];
  Object.keys(data).forEach(theNode => {
    const theData = data[theNode];

    const providers = new Map();
    theData.map(item => providers.set(item.provider, 1));

    providers.forEach((v, theProvider) => {
      const providerData = theData.filter(
        item => item.provider === theProvider,
      );
      if (theData && theData.length > 0)
        promissePublish.push(
          starws.publishMetrics(theProvider, theNode, providerData, true),
        );
    });
  });
  const endPromisse = await Promise.all(promissePublish);
  const errorRequest = endPromisse.filter(
    resp => resp && resp.status && resp.status !== 201,
  );
  if (errorRequest && errorRequest.length > 0) {
    const err = new Error('Error requesting bind-starws.');
    err.errorRequest = errorRequest.map(resp => {
      return {
        status: resp.status,
        data: resp.data && resp.data.data ? resp.data.data : [],
        code: resp.data && resp.data.code ? resp.data.code : 0,
        message:
          resp.data && resp.data.message ? resp.data.message : 'Unknown Error',
      };
    });
    throw err;
  }
};

const run = async ({
  nodes,
  provider,
  scraperPoint,
  organization,
  sourceData,
}) => {
  logger.info('Starting scraper process');

  try {
    if (!sourceData && scraperPoint) {
      logger.info(
        `Getting list of source data in scraper point ${scraperPoint}`,
      );
      // eslint-disable-next-line global-require
      const scraperMode = require(`./scraper/${scraperPoint}`);
      sourceData = await scraperMode({ provider, organization });
    } else if (!sourceData && !scraperPoint) {
      const msg = 'No scraperPoint and sourceData provided';
      logger.error(msg);
      throw new Error(msg);
    }

    logger.info('Loading data from githunter-api');
    // sourceData is Array!
    const data = await loadDataFromGithunterAPI(sourceData, nodes);

    const hasData = Object.values(data).reduce(
      (accumulator, item) => accumulator + item.length,
      0,
    );
    if (hasData) {
      logger.info('Save data in StarWS');
      await saveStarWS(data);

      // Build the response
      const mappedData = {};
      const mappedObj = [];
      Object.keys(data).forEach(node => {
        mappedData[node] = data[node].map(item => {
          const mapper = contractResponse[node];
          if (mapper) {
            return mapper({ ...item, node });
          }
          return {};
        });

        // Transform an array of object in object of array grouping by keys
        const mergedObj = {};
        mappedData[node].map(item => {
          Object.keys(item).map(val => {
            mergedObj[val] =
              mergedObj[val] && mergedObj[val].length > 0
                ? _.concat(mergedObj[val], item[val])
                : item[val];
            return val;
          });
          return item;
        });

        // Removing empty values and duplicated values (if array has one item, remove from array)
        Object.keys(mergedObj).map(key => {
          mergedObj[key] = _.compact(mergedObj[key]);
          mergedObj[key] = _.uniqBy(mergedObj[key]);
          if (Array.isArray(mergedObj[key]) && mergedObj[key].length === 1) {
            // eslint-disable-next-line prefer-destructuring
            mergedObj[key] = mergedObj[key][0];
          }
          return key;
        });

        mappedObj.push(mergedObj);
      });

      return mappedObj;
    }
    return {};
  } catch (e) {
    logger.error(`Error Scraper: ${e.message}`);
    logger.error(`%j`, {
      nodes,
      provider,
      scraperPoint,
      organization,
      sourceData,
    });
    throw e;
  }
};

module.exports = {
  run,
};
