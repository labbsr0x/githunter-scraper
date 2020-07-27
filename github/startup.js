'use strict';

const trendingPage = require("./pages/trending/inspect");
const config = require("./config");

const run = () => {
    trendingPage(config.url);
}

module.exports = {run};