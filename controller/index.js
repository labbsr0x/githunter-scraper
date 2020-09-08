const githunterApi = require('../githunter-api/controller');
const codeInfoRepository = require('../database/repositories/CodeInfoRepository');
const starws = require('../star-ws/controller');
const contract = require('../contract/starWs.mapper');

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

  codeInfoRepository.save(normalizedData);
};

const readInformation = async (node, sourceData) => {
  const theMaker = contract[node];

  const normalizedData = [];
  const response = await nodesSource[node](sourceData);
  if (!response || (response.data && response.data.length === 0))
    return normalizedData;

  if (!response.data && !Array.isArray(response)) {
    response.data = [response];
  }
  Object.values(response.data).forEach(theData => {
    normalizedData.push(
      theMaker({
        ...theData,
        ...sourceData,
      }),
    );
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
        console.log(e);
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
          console.log(e);
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
    theData.map(item => providers.set(item.fields.provider, 1));

    providers.forEach((_, theProvider) => {
      const providerData = theData.filter(
        item => item.fields.provider === theProvider,
      );
      if (theData && theData.length > 0)
        starws.publishMetrics(theProvider, theNode, providerData);
    });
  });
};

const run = async ({ scraperPoint, nodes, provider, organization }) => {
  console.log('Starting scraper process');

  try {
    if (!scraperPoint) {
      console.log('No scraperPoint provided');
      return;
    }

    console.log(`Getting list of source data in scraper point ${scraperPoint}`);
    // eslint-disable-next-line global-require
    const scraperMode = require(`./scraper/${scraperPoint}`);
    const sourceData = await scraperMode({ provider, organization });

    if (!sourceData) {
      console.log('No source data for load.');
      return;
    }

    console.log('Loading data from githunter-api');
    const data = await loadDataFromGithunterAPI(sourceData, nodes);

    const hasData = Object.values(data).reduce(
      (accumulator, item) => accumulator + item.length,
      0,
    );
    if (hasData) {
      console.log('Save data in StarWS');
      saveStarWS(data);
    }
  } catch (e) {
    console.log('error in controller');
    console.log(e);
  }
};

module.exports = {
  run,
};
