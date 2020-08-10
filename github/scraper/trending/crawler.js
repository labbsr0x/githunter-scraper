"use strict";

const Crawler = require("crawler");
const database = require("../../../database");

const defaultCallback = (error, res, done) => {
  if (error) {
    console.log(error);
  } else {
    cb.callback(res);
  }
  done();
};

const c = new Crawler({
  // rateLimit: 2000,
  maxConnections: 100,
  retries: 1,
  callback: defaultCallback,
});

module.exports = c;
