"use strict";

const Crawler = require("crawler");

const defaultCallback = (error, res, done) => {
  if (error) {
    console.log(error);
  } else {
    cb.callback(res);
  }
  done();
};

const c = new Crawler({
  maxConnections: 10,
  callback: defaultCallback,
});

// Trigger when became empty
c.on("drain", () => {
  console.log("Empty queue. Process ran successfully.")
});

module.exports = c;
