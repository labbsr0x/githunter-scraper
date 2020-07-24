"use strict";

const Crawler = require("crawler");
const Data = require("../data/data");

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
  console.log(Data.toJSON());
  Data.clear();
  console.log(Data.data);
});

module.exports = c;
