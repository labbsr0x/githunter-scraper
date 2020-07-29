"use strict";

const config = require("./config");
const c = require("../../crawler");

const init = (path, identifier) => {
  c.queue({
    uri: config.url + path,
    callback: (error, res, done) => {
      callback(error, res, done, identifier)
    },
  });
};

const callback = (error, res, done, id) => {
  
};

module.exports = init;
