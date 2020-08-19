'use strict';

const express = require('express');
const conductorController = require("../conductor/controller");

const init = (middlewares) => {
  const router = express.Router();

  if (middlewares) {
    middlewares.forEach(middleware => router.use(middleware));
  }

  router.get("/conductor", conductorController);

  return router;
};

module.exports = init