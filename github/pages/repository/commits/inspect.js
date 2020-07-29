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
  if (error) {
    console.log(error);
    done();
    return;
  }

  var $ = res.$;

  const values  = {};

  const allCommitsMsg = $("div.flex-auto.min-width-0 > p");
  console.log(`typeof: ${typeof allCommitsMsg}`);
  const allComiitsTime = $("div.f6.text-gray.min-width-0 > relative-time");
  const tmp = Object.values(allCommitsMsg[0].children[1].attribs)[0];
  const tmp2 = Object.values(allCommitsMsg[0].children[1].attribs)[1];
  values["commits"] = [];
  for(let i = 0; i < allComiitsTime.length; i++) {
    const commits = {
      msg: (Object.values(allCommitsMsg[i].children[1].attribs)[0]),
      url: (Object.values(allCommitsMsg[0].children[1].attribs)[3]),
      datetime: allComiitsTime[i].attribs.datetime
    }
    values["commits"].push(commits);
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
