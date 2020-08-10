'use strict';

const express = require('express');
const conductorController = require("../conductor/controller");

const init = (middlewares) => {
  const router = express.Router();

  if (middlewares) {
    middlewares.forEach(middleware => router.use(middleware));
  }

  router.get("/conductor", conductorController);

  router.get("/v1/repos", (req, res) => {
      const {name, owner} = req.query;
      const resp = {
        name: name,
        owner: owner,
        license: "MIT",
        about: "about",
        topics: [
            "topic 1",
            "topic 2"
        ]
      }
      res.send(resp);
  });

  router.get("/v1/commits", (req, res) => {
    const {name, owner} = req.query;
    const resp = {
      nome: name,
      dono: owner,
      no: "commits"
    }
    res.send(resp);
})

router.get("/v1/pulls", (req, res) => {
    const {name, owner} = req.query;
    const resp = {
      nome: name,
      dono: owner,
      no: "pulls"
    }
    res.send(resp);
})

  return router;
};

module.exports = init