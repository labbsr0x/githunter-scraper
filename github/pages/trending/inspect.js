"use strict";

const c = require("../crawler");
const repositoryCodePage = require("../repository/code/inspect");
const repositoryIssuesPage = require("../repository/issues/inspect");
const Data = require("../../data/data");

// const repoPage
const config = require("./config");

const init = () => {
  c.queue({
    uri: config.url + config.path,
    callback: callback,
  });
};

const callback = (error, res, done) => {
  if (error) {
    console.log(error);
    done();
    return;
  }
  var $ = res.$;
  const articles = $("article>h1>a");
  console.log(articles.length);
  for (const key in articles) {
    // create mongo (use ID) -> if needed
    const item = articles[key];
    if (item && item.attribs && item.attribs.href) {
      Data.setName(item.attribs.href, item.attribs.href);
      repositoryCodePage(config.url + item.attribs.href, item.attribs.href);
      repositoryIssuesPage(config.url + item.attribs.href, item.attribs.href);
    }
  }
  done();
};

module.exports = init;
