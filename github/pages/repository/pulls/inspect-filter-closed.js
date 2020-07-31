"use strict";

const config = require("./config");
const c = require("../../crawler");
const pullPage = require("../pull/inspect");
const repoRepository = require("../../../../database/repositories/RepoRepository");

const init = (url, identifier) => {
  c.queue({
    uri: url + config.path + "?" + config.filterClosedQS,
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

  const values  = {
    pulls: {}
  };

  const lastPull =  $("main#js-repo-pjax-container relative-time");
  if (lastPull && lastPull.length){
    values["pulls"]["lastPullClosed"] = lastPull[0].attribs.datetime;
  }

  // const pullsLinks = Object.values($("[id^=issue_][id$=_link]")).filter(item => item.attribs && item.attribs.href).map(item => item.attribs.href);
  // for (let i = 0; i < pullsLinks.length; i++) {
  //   const url = pullsLinks[i];
  //   pullPage(url, id);
  // }

  //update mongo
  save(id, values);
  
  done();
};

const save = async (id, values) => {
  const doc = await repoRepository.findOneAndUpdate({ _id: id }, values);
}

module.exports = init;
