const c = require('../crawler');
const config = require('./config');

const callback = async (error, res, done) => {
  if (error) {
    console.log(error);
    done();

    throw new Error(error);
  }

  if (res && res.statusCode !== 200) {
    console.log(
      `Error requesting page: ${res.options.uri}, Status Code: ${res.statusCode}`,
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
  const articles = $('li.project-row .project-title a');

  Object.values(articles).forEach(item => {
    // Getting all repos in trending page
    // const item = articles[key];

    if (item && item.attribs && item.attribs.href) {
      // Getting id for database
      const repo = item.attribs.href.split('/');
      repo.shift(); // remove first white space
      const owner = repo.shift();
      const name = repo.join("/");
      if (owner && name) repos.push({ owner, name });
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
