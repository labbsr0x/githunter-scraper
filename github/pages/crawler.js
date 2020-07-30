"use strict";

const Crawler = require("crawler");
const database = require("../../database");

const defaultCallback = (error, res, done) => {
  if (error) {
    console.log(error);
  } else {
    cb.callback(res);
  }
  done();
};

const proxiesList = [
  'http://187.17.19.90:44985',
  'http://177.8.216.114:8080',
]

let proxies =  JSON.parse(JSON.stringify(proxiesList));

const c = new Crawler({
  // rateLimit: 2000,
  maxConnections: 100,
  retries: 100,
  callback: defaultCallback,
});

// Trigger when became empty
c.on("drain", () => {
  console.log("Empty queue. Process ran successfully.");
  // database.disconectDB();
});

c.on('schedule', (options) => {

  if (proxies.length == 0){
    proxies = JSON.parse(JSON.stringify(proxiesList));
    options.proxy = undefined;
  }

  if (options.updateProxy){
    let index = proxies.indexOf(options.proxy);
    if (index !== -1)
      proxies.splice(index, 1);
    options.proxy = proxies[0];
  }

  console.log(`Queue size: ${c.queueSize}`);
  
});

module.exports = c;
