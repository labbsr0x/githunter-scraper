const githunterApi = require('../githunter-api/controller');
const db = require('../database/repositories/RepoRepository');
const env = require('../env');
const starws = require('../star-ws/controller');
const contract = require('../contract/startWs.mapper');

const api = {
  pulls: githunterApi.getRepositoryPullsRequest,
  issues: githunterApi.getRepositoryIssues,
  commits: githunterApi.getRepositoryCommits,
};

const readRepositoryInformation = async repo => {
  const repoInfo = await githunterApi.getRepositoryInformation(repo);
  db.save(repoInfo);
};

const readInformation = async (node, repo) => {
  const theMaker = contract[node];

  const normalizedData = [];
  const response = await api[node](repo);
  if (!response) return false;
  Object.keys(response.data).forEach(theData => {
    normalizedData.push(theMaker({ ...theData, ...repo }));
  });

  return normalizedData;
};

const loadDataFromGithunterAPI = async repoList => {
  const data = {};
  // console.log(`START ton of request: ${moment().format()}`);
  const promises = repoList.map(async repo => {
    if (
      !env.flags.nodes ||
      (env.flags.nodes && env.flags.nodes.includes('repository'))
    ) {
      try {
        readRepositoryInformation(repo);
      } catch (e) {
        console.log(e);
      }
    }

    const nodes = ['commits', 'pulls', 'issues'];
    nodes.forEach(async node => {
      if (
        !env.flags.nodes ||
        (env.flags.nodes && env.flags.nodes.includes(node))
      ) {
        if (!data[node]) data[node] = [];
        try {
          const info = await readInformation(node, repo);
          if (info && info.length > 0) {
            data[node].concat(info);
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  });

  await Promise.all(promises);

  // console.log(`END ton request: ${moment().format()}`);
  return data;
};

const saveStarWS = data => {
  Object.keys(data).forEach(theNode => {
    const theData = data[theNode];
    if (theData && theData.length > 0) starws.publishMetrics(theNode, theData);
  });
};

const run = async () => {
  console.log('Starting scraper process');

  try {
    console.log('Getting List of repositories list');
    // eslint-disable-next-line global-require
    const scraperMode = require(`./scraper/${env.flags.scraperPoint}`);
    const repos = await scraperMode();
    console.log('Loading data from githunter-api for repositories list');
    const data = await loadDataFromGithunterAPI(repos);
    console.log('Save data in StarWS');
    saveStarWS(data);
    console.log('Done!');
  } catch (e) {
    console.log('error in controller');
    console.log(e);
  }
};

module.exports = { run };
