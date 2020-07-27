"use strict";

const c = require("../../crawler");
// const Mongo = require("../../../../mongo/Mongo");

const init = (url, identifier) => {
  c.queue({
    uri: url,
    callback: (error, res, done) => {
      callback(error, res, done, identifier)
    },
  });
};

const callback = (error, res, done, id) => {
  if (error) {
    console.log(error);
    done();
    return;
  }
  var $ = res.$;

  const values  = [];
  values["about"] = $("p.f4.mt-3").text();
  values["contributorsQuantity"] = $("main#js-repo-pjax-container div:nth-child(4) > div > h2 > a > span").text();

  const topics = $("a.topic-tag.topic-tag-link");
  values["topics"] = [];
  for (let i=0; i < topics.length; i++) {
    values["topics"].push($(topics[i]).text().trim());
  }

  const languages = $("span.text-gray-dark.text-bold.mr-1");
  values["languages"] = [];
  for (let i=0; i < languages.length; i++) {
    const item = $(languages[i]);
    const theLanguage = {
      name: item.text(),
      percent: item.next().text()
    }
    values["languages"].push(theLanguage)
  }
  
  //update mongo
  save(id, values);

  done();
};

const save = (id, values) => {
  // for (const field in values) {
  //   Mongo.update(id, field, values[field]);
  // }
}

module.exports = init;
