"use strict";

const c = require("../crawler");
const repositoryCodePage = require("../repository/code/inspect");
const repositoryIssuesPage = require("../repository/issues/inspect");
const repositoryPullPage = require("../repository/pulls/inspect");
const config = require("./config");
const repoRepository = require("../../../database/repositories/RepoRepository");

const init = () => {
  c.queue({
    uri: config.url + config.path,
    callback: callback,
  });
};

const callback = async (error, res, done) => {
  if (error) {
    console.log(error);
    done();
    return;
  }

  if (res && res.statusCode != 200) {
    console.log(`Error requesting page: ${res.options.uri}, Status Code: ${res.statusCode}`);

    if (res.statusCode == 429) {
      res.options.updateProxy = true;
      c._schedule(res.options);
    }

      done();
      return;
  }
  var $ = res.$;
  const articles = $("article>h1>a");
  console.log(articles.length);
  for (const key in articles) {
    // Getting all repos in trending page
    const item = articles[key];

    if (item && item.attribs && item.attribs.href) {
      //Getting id for database
      const { id } = await repoRepository.findOrCreate({ name: item.attribs.href });

      //repositoryCodePage(config.url + item.attribs.href, id);
      //repositoryIssuesPage(config.url + item.attribs.href, id);
      repositoryPullPage(config.url + item.attribs.href, id);
    }
  }
  done();
};

module.exports = init;
