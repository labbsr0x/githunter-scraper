const ConductorClient = require('conductor-client').default;
const configConductor = require('config').get('conductor');

const logger = require('../../config/logger');
const tasks = require('./tasks');

class Client {
  constructor() {
    logger.info(
      `Start conductor client on ${configConductor.url} with workerID ${configConductor.workerID}`,
    );

    this.conductorClient = new ConductorClient({
      baseURL: configConductor.url,
      workerID: configConductor.workerID,
    });
  }

  run() {
    Object.keys(tasks).forEach(id => {
      this.conductorClient.registerWatcher(
        id,
        tasks[id],
        { pollingIntervals: 1000, autoAck: true, maxRunner: 1 },
        true,
      );
    });
  }
}

const client = () => {
  const conductorClient = new Client();
  conductorClient.run();
};

module.exports = client;
