const Crawler = require('crawler');

const c = new Crawler({
  // rateLimit: 2000,
  maxConnections: 100,
  retries: 1,
});

module.exports = c;
