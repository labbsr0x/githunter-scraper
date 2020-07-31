"use strict";

const config = require("./config");
const c = require("../../crawler");
const RepoRepository = require("../../../../database/repositories/RepoRepository");

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
      pulls: {
          "$push": {
              list: {}
         }
      }
  };

  const discutions = Object.values($("div.timeline-comment-group.js-minimizable-comment-group.js-targetable-element.TimelineItem-body.my-0 > div > div.timeline-comment-header.clearfix > h3 > a > relative-time"))
            .filter(item => item.attribs && item.attribs.datetime)
            .map(item => item.attribs.datetime);

  const thePull = {}
  if (discutions && discutions.length) {
    thePull["openDatetime"] = discutions[0];
    thePull["closedDatetime"] = discutions[(discutions.length-1)];
  }

  thePull["pullNumber"] = $("div#partial-discussion-header div.gh-header-show > h1 > span.gh-header-number").text().replace("#","");

  values["pulls"]["$push"]["list"] = thePull;

  //update mongo
  save(id, values);
  
  done();
};

const save = async (id, values) => {
    const doc = await RepoRepository.findOneAndUpdate({ _id: id }, values);
  }

module.exports = init;
