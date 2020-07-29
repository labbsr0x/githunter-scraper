"use strict";

const c = require("../../crawler");
const repositoryCommitsPage = require("../commits/inspect");
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

  const values  = {};

  //count watches
  var rawCountWatches = $("ul.pagehead-actions.flex-shrink-0 > li:nth-last-child(3)")[0].children[3].attribs;
  values["watchers"] = Object.values(rawCountWatches)[2].replace(/[ A-Za-z]/g, "");

  //count starts
  var rawCountStars = $("ul.pagehead-actions.flex-shrink-0 > li:nth-last-child(2)")[0].children[3].attribs;
  values["stars"] = Object.values(rawCountStars)[2].replace(/[ A-Za-z]/g, "");

  //count forks
  var rawCountForks = $("ul.pagehead-actions.flex-shrink-0 > li:nth-last-child(1)")[0].children[3].attribs;
  values["forks"] = Object.values(rawCountForks)[2].replace(/[ A-Za-z]/g, "");

  //default branch master
  var defaultBranch = $("details#branch-select-menu > summary").text();
  values["defaultBranch"] = defaultBranch.replace("\n", "").trim();

  //last commit
  const rawLastCommitTime = $("relative-time")[0];
  if(rawLastCommitTime.attribs !== "undefined") {
    values["lastCommitTime"]  = rawLastCommitTime.attribs.datetime;
  }

  //count commits
  values["commitsQuantity"] = $("li.ml-0.ml-md-3 > a > span > strong").text();

  //about
  var rawAbout = $("p.f4.mt-3").text();
  values["about"] = rawAbout.replace("\n", "").trim();
  
  //have a site?
  const rawUrl = $("div.BorderGrid-row.hide-sm.hide-md > div.BorderGrid-cell > div.mt-3.d-flex.flex-items-center > span.flex-auto.min-width-0.css-truncate.css-truncate-target.width-fit > a");
  if(rawUrl.length) {
    values["url"] = rawUrl[0].attribs.href;
  }
  //have a topics?
  const topics = $("a.topic-tag.topic-tag-link");
  values["topics"] = [];
  for (let i=0; i < topics.length; i++) {
    values["topics"].push($(topics[i]).text().trim());
  }

  values["readme"] = false;
  values["license"] = false;
  const resources = $("div.BorderGrid-row.hide-sm.hide-md > div.BorderGrid-cell > div.mt-3 > a");
  if(resources) {
    for(let i = 0; i < resources.length; i++) {
      if(resources[i] !== "undefined") {
        //have a readme?
        if(resources[i].attribs.href.includes("readme")) {
          values["readme"] = true;
        }
        //have a license?
        if(resources[i].attribs.href.includes("LICENSE")) {
          values["license"] = true;
        }
      }
    }
  }

  const rawReleaseContributors = $("div.BorderGrid-row > div.BorderGrid-cell > h2.h4.mb-3 > a");
  if(rawReleaseContributors.length) {
    for(let i = 0; i < rawReleaseContributors.length; i++) {
      if(rawReleaseContributors[i] !== "undefined") {
        //have release? how many?
        if(rawReleaseContributors[i].attribs.href.includes("releases") && rawReleaseContributors[i].children.length > 1) {
          values["releases"] = rawReleaseContributors[i].children[1].attribs.title;
        }
        //have contributor? how many?
        if(rawReleaseContributors[i].attribs.href.includes("contributors")) {
          values["contributorsQuantity"] = rawReleaseContributors[i].children[1].attribs.title;
        }
      }
    }
  }

  //have a languages? how many? what?
  const languages = $("span.text-gray-dark.text-bold.mr-1");
  if(languages.length) {
    values["languages"] = [];
    for(let i = 0; i < languages.length; i++) {
      const item = $(languages[i]);
      const theLanguage = {
        name: item.text(),
        percent: item.next().text()
      }
      values["languages"].push(theLanguage)
    }
  }
  
  //update mongo
  save(id, values);

  //get path branch default commits
  const path = $("a.pl-3.pr-3.py-3.p-md-0.mt-n3.mb-n3.mr-n3.m-md-0.link-gray-dark.no-underline.no-wrap")[0];
  repositoryCommitsPage(path.attribs.href, id);

  done();
};

const save = (id, values) => {
  // for (const field in values) {
  //   Mongo.update(id, field, values[field]);
  // }
}

module.exports = init;
