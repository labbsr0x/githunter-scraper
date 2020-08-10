'use strict';

const trendingController = require("./scraper/trending/controller");
const env = require("../env");

const run = () => {
    scraperMode[env.flags.scraperPoint]();
}

const scraperByTrending = () => {
    trendingController.run();
}

const scraperMode = {
    trending: scraperByTrending
}

module.exports = {run};