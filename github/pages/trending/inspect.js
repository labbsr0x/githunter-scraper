"use strict";

const c = require("../crawler");
const repositoryCodePage = require("../repository/code/inspect");
const repositoryIssuesPage = require("../repository/issues/inspect");

const config = require("./config");
// const Mongo = require("../../../mongo/Mongo");

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
    // Getting all repos in trending page
    const item = articles[key];

    if (item && item.attribs && item.attribs.href) {
      //Getting id for database
      const id = item.attribs.href; //Mongo.createDoc(item.attribs.href);

      //Saving name
      // Mongo.update(id, "name", item.attribs.href);

      repositoryCodePage(config.url + item.attribs.href, id);
      repositoryIssuesPage(config.url + item.attribs.href, id);
    }
  }
  done();
};

module.exports = init;
