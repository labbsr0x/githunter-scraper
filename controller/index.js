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
};

const readCodePageInformation = async repo => {
  const maker = contract.code;
  const data = await githunterApi.getCodePageInformation(repo);
  if (!data) return;
  const normalizedData = maker({
    ...data,
    ...repo,
  });

  githunterDataProvider.saveCodeInfo(normalizedData);
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
  // Save JSON Data
  const rawDataPromise = [];
  Object.values(arrayData).forEach((theData, index) => {
    rawDataPromise[index] = starws.saveJSONData(theData);
  });

  const rawDataValues = await Promise.all(rawDataPromise);

  Object.values(arrayData).forEach((theData, index) => {
    const rawData = rawDataValues[index];
    normalizedData.push({
      ...theData,
      ...sourceData,
      rawData,
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
        readCodePageInformation(data);
      } catch (e) {
        logger.error(e);
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
          logger.error(e);
        }
      }
    }
  });

  await Promise.all(promises);

  // console.log(`END ton request: ${moment().format()}`);
  return normalizedData;
};

const saveStarWS = data => {
  Object.keys(data).forEach(theNode => {
    const theData = data[theNode];

    const providers = new Map();
    theData.map(item => providers.set(item.provider, 1));

    providers.forEach((v, theProvider) => {
      const providerData = theData.filter(
        item => item.provider === theProvider,
      );
      if (theData && theData.length > 0)
        starws.publishMetrics(theProvider, theNode, providerData);
    });
  });
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
      logger.error('No scraperPoint and sourceData provided');
      return {};
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
      saveStarWS(data);

      // Build the response
      const mappedData = {};
      const mappedObj = {};
      Object.keys(data).forEach(node => {
        mappedData[node] = data[node].map(item => {
          const mapper = contractResponse[node];
          if (mapper) {
            return mapper(item);
          }
          return {};
        });

        // Transform an array of object in object of array grouping by keys
        mappedData[node].map(item => {
          Object.keys(item).map(val => {
            if (!mappedObj[node]) mappedObj[node] = {};
            mappedObj[node][val] = mappedObj[node][val]
              ? _.concat(mappedObj[node][val], item[val])
              : item[val];
            return val;
          });
          return item;
        });

        // Removing empty values
        if (mappedObj[node]) {
          Object.keys(mappedObj[node]).map(key => {
            mappedObj[node][key] = _.compact(mappedObj[node][key]);
            return key;
          });
        }
      });

      return mappedObj;
    }
    return {};
  } catch (e) {
    logger.error(`error in controller!`, e);
    throw e;
  }
};

module.exports = {
  run,
};
