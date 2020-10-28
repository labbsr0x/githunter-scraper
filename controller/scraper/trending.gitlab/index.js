const logger = require('../../../config/logger');
const c = require('../../../crawler/crawler');
const config = require('./config');

const callback = async (error, res, done) => {
  if (error) {
    logger.error(error);
    done();

    throw new Error(error);
  }

  if (res && res.statusCode !== 200) {
    logger.error(
      `CONTROLLER -> Trending Gitlab: Error requesting page: ${res.options.uri}, Status Code: ${res.statusCode}`,
    );

    if (res.statusCode === 429) {
      res.options.updateProxy = true;

      // eslint-disable-next-line no-underscore-dangle
      c._schedule(res.options);
    }

    done();

    throw new Error(`response status code ${res.statusCode}`);
  }

  const { $ } = res;
  const repos = [];
  const { provider } = config;
  const articles = $('li.project-row .project-title a');

  Object.values(articles).forEach(item => {
    if (item && item.attribs && item.attribs.href) {
      // Getting id from href attribute
      const repo = item.attribs.href.split('/');
      repo.shift(); // remove first white space
      const owner = repo.shift();
      const name = repo.join('/');
      if (owner && name) repos.push({ owner, name, provider });
    }
  });

  done();
  return repos;
};

const getRepos = () => {
  return new Promise((resolve, reject) => {
    c.queue({
      uri: config.url + config.path,
      callback: async (error, res, done) => {
        try {
          const repos = await callback(error, res, done);
          resolve(repos);
        } catch (e) {
          reject(e);
        }
      },
    });
  });
};

module.exports = getRepos;
