"use strict";

const c = require("../../crawler");
const Data = require("../../../data/data");

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

  Data.setAbout(id, $("p.f4.mt-3").text());
  Data.setContributorsQuantity($("span.Counter").text());

  const topics = $("a.topic-tag.topic-tag-link");
  for (let i=0; i < topics.length; i++) {
    Data.addTopic(id, $(topics[i]).text().trim());
  }

  const languages = $("span.text-gray-dark.text-bold.mr-1");
  for (let i=0; i < languages.length; i++) {
    const item = $(languages[i]);
    const theLanguage = {
      name: item.text(),
      percent: item.next().text()
    }
    Data.addLanguage(id, theLanguage);
  }
  
  //update mongo
  done();
};

module.exports = init;
