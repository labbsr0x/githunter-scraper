const BaseRepository = require('./BaseRepository')
const Repo = require('../models/Repo')

class RepoRepository extends BaseRepository {
  constructor(){
    super(Repo);
  }

  async findOrCreate(body){
    const results = await this.findByName(body["name"]);

    if(results && results.length){
      return results[0]
    } 

    return super.create(body);
  }

  async findByName(name){
    return super.find({ name: name });
  }
}

module.exports = new RepoRepository();
