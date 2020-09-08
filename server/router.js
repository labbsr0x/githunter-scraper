const express = require('express');

const init = middlewares => {
  const router = express.Router();

  if (middlewares) {
    middlewares.forEach(middleware => router.use(middleware));
  }

  return router;
};

module.exports = init;
