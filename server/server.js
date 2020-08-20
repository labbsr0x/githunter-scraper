const config = require('config');
const express = require('express');

const configFeed = config.get('server');

const initRoutes = async app => {
  // Routers
  const routers = require('./router');
  app.use(configFeed.baseDir, routers());
};

const configureApp = app => {
  const bodyParser = require('body-parser');

  app.use(bodyParser.json());

  const cors = require('cors');
  app.use(cors());
};

const startApp = app => {
  const http = require('http');
  const server = http.createServer(app);

  server.listen(configFeed.port, configFeed.url, () => {
    const env = config.util.getEnv('NODE_ENV');
    console.log(`Starting app for environment: ${env}`);
    console.log(`Port: ${configFeed.port}`);
    // print a message when the server starts listening
    console.log(`server starting on ${configFeed.url}:${configFeed.port}`);
  });
};

const connectDB = () => {
  const database = require('../database');
  return database.connectDB();
};

const server = () => {
  const app = express();
  connectDB();
  configureApp(app);
  initRoutes(app);
  startApp(app);
};

module.exports = server;
