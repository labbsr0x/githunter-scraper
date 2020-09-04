const express = require('express');
const conductorController = require('../conductor/controller');
const mongoDBController = require('../database/server.controller');

const init = middlewares => {
  const router = express.Router();

  if (middlewares) {
    middlewares.forEach(middleware => router.use(middleware));
  }

  router.get('/conductor', conductorController);

  router.get('/mongo/data', mongoDBController);

  return router;
};

module.exports = init;
