const trendingController = require('./scraper/trending/controller');
const env = require('../env');

const scraperByTrending = () => {
  trendingController.run();
};

const scraperMode = {
  trending: scraperByTrending,
};

const run = () => {
  scraperMode[env.flags.scraperPoint]();
};

module.exports = { run };
