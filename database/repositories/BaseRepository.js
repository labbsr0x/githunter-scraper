class BaseRepository{
  constructor(Model){
    this.collection = Model
  }

  async find(query = {}, { multiple = true, count, lean } = {}){
    const results = multiple
      ? this.collection.find(query)
      : this.collection.findOne(query);
    
    return results;
  }

  async create(body){
    const document = new this.collection(body);

    return document.save()
  }

  async findOneAndUpdate(conditions, update){
    return this.collection.findOneAndUpdate(conditions, update, {new: true})
  }

  async save (body) {
    const doc = await this.find({name : body.name, owner: body.owner}, false);
    if (doc && doc.length == 0){
      return  this.create(body);
    }
    return this.findOneAndUpdate({_id: doc[0].id}, body);
  }

}

module.exports = BaseRepository;