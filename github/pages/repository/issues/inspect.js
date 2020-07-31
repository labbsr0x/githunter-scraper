"use strict";

const config = require("./config");
const c = require("../../crawler");

const init = (url, identifier) => {
  c.queue({
    uri: url + config.path,
    callback: (error, res, done) => {
      callback(error, res, done, identifier)
    },
  });
};

const callback = (error, res, done, id) => {
  if (error) {
    console.log(error);
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

  const values  = [];

  let open = $("div#js-issues-toolbar a.btn-link.selected").text().trim();
  open = open.split(" ");
  values["open"] = open[0];
  //console.log(`${id} -> open issues: ${values["open"]}`);

  let closed = $("div#js-issues-toolbar div.flex-auto.d-none.d-lg-block.no-wrap > div > a:nth-child(2)").text().trim();
  closed = closed.split(" ");
  values["closed"] = closed[0];
  
  //console.log(`${id} -> closed issues: ${values["closed"]}`);
  done();
};

module.exports = init;
