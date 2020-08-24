const BaseRepository = require('./BaseRepository');
const Repo = require('../models/Repo');

class RepoRepository extends BaseRepository {
  constructor() {
    super(Repo);
  }
}

module.exports = new RepoRepository();
