const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');

const database = require('../database');
const routers = require('./router');

const configFeed = config.get('server');

const initRoutes = async app => {
  app.use(configFeed.baseDir, routers());
};

const configureApp = app => {
  app.use(bodyParser.json());
  app.use(cors());
};

const startApp = app => {
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
