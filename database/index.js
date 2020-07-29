const mongoose = require('mongoose');

class ManageDB {
  constructor({config, logger}){
    this.config = config;
    this.logger = logger;
  }

  async connect(){
    let credentials = '';

    if(this.config.auth){
      credentials = `${this.config.user}:${this.config.password}@` 
    }

    const connection = typeof this.config === 'string'
      ? this.config
      : `mongodb://${credentials}${this.config.host}:${this.config.port}/${this.config.database}`;
    
    const options = this.config.ENV == 'prod'
     ? {autoIndex: false}
     : {};

    this.logger.debug('Connecting to the database...');

    //mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false);
    //mongoose.set('debug', true);

    await mongoose
      .connect(connection, { useNewUrlParser: true })
      .catch(error => {
        this.logger.error('Error while connecting to the database', error)
        throw(error);
      });

    this.logger.debug('Connected to the database');
  }

  static async close(){
    this.logger.debug('Closing database...');

    await mongoose.connection.close().catch(error => {
      this.logger.error('Error while closing the database', error)
      throw(error);
    })

    this.logger.debug('Database closed');
  }
}

module.exports = ManageDB;