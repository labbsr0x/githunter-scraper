"use strict";

const config = require("./config");
const c = require("../../crawler");

let id;

const init = (url, identifier) => {
  id = identifier;
  c.queue({
    uri: url + config.path,
    callback: (error, res, done) => {
      callback(error, res, done, identifier)
    },
  });
};

const callback = (error, res, done, id) => {
  if (error) {
    console.log(error);
    return;
  }
  var $ = res.$;
  console.log($("title").text());
  done();
};

module.exports = init;
