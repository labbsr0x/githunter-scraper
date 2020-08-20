const mongoose = require('mongoose');
const configuration = require('config');

class ManageDB {
  constructor({ config, logger }) {
    this.config = config;
    this.logger = logger;
  }

  async connect() {
    let credentials = '';

    if (
      this.config.credentials &&
      this.config.credentials.user &&
      this.config.credentials.password
    ) {
      credentials = `${this.config.credentials.user}:${this.config.credentials.password}@`;
    }

    const connection =
      typeof this.config === 'string'
        ? this.config
        : `mongodb://${credentials}${this.config.host}:${this.config.port}/${this.config.database}`;

    // const options = this.config.ENV == 'prod' ? { autoIndex: false } : {};

    this.logger.debug('Connecting to the database...');

    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useUnifiedTopology', true);
    // mongoose.set('debug', true);

    await mongoose
      .connect(connection, { useNewUrlParser: true })
      .catch(error => {
        this.logger.error('Error while connecting to the database', error);
        throw error;
      });

    this.logger.debug('Connected to the database');
  }

  async close() {
    this.logger.debug('Closing database...');

    await mongoose.connection.close().catch(error => {
      this.logger.error('Error while closing the database', error);
      throw error;
    });

    this.logger.debug('Database closed');
  }
}

let db;
const connectDB = (config = false) => {
  config = config || configuration.get('mongo');

  db = new ManageDB({ config, logger: console });
  return db.connect();
};

const disconectDB = () => {
  if (db) db.close();
};

module.exports = { connectDB, disconectDB };
