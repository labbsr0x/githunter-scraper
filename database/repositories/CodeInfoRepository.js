const BaseRepository = require('./BaseRepository');
const Code = require('../models/Code');

class CodeRepository extends BaseRepository {
  constructor() {
    super(Code);
  }
}

module.exports = new CodeRepository();
