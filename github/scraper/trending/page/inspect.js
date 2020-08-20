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
  const articles = $('article>h1>a');

  articles.forEach(key => {
    // Getting all repos in trending page
    const item = articles[key];

    if (item && item.attribs && item.attribs.href) {
      // Getting id for database
      const repo = item.attribs.href.split('/');
      if (repo.length) repos.push({ owner: repo[1], name: repo[2] });
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
