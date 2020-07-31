"use strict";

const config = require("./config");
const c = require("../../crawler");
const pullsClosedPage = require("./inspect-filter-closed");
const repoRepository = require("../../../../database/repositories/RepoRepository");

const init = (url, identifier) => {
  c.queue({
    uri: url + config.path,
    callback: (error, res, done) => {
      callback(error, res, done, identifier)
    },
  });

  pullsClosedPage(url, identifier);
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

  let open = $("div#js-issues-toolbar a.btn-link.selected").text().trim();
  open = open.split(" ");
  values["pulls"]["open"] = open[0];

  let closed = $("div#js-issues-toolbar div.flex-auto.d-none.d-lg-block.no-wrap > div > a:nth-child(2)").text().trim();
  closed = closed.replace(",","").split(" ");
  values["pulls"]["closed"] = closed[0];

  const lastPull = $("main#js-repo-pjax-container relative-time");
  if (lastPull && lastPull.length){
    values["pulls"]["lastPullOpened"] = lastPull[0].attribs.datetime;
  }

  //update mongo
  save(id, values);
  done();
};

const save = async (id, values) => {
  const doc = await repoRepository.findOneAndUpdate({ _id: id }, values);
}

module.exports = init;