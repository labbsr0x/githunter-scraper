class BaseRepository {
  constructor(Model) {
    this.Collection = Model;
  }

  async find(query = {}, {
    multiple = true
  } = {}) {
    const results = multiple ?
      this.Collection.find(query) :
      this.Collection.findOne(query);

    return results;
  }

  async create(body) {
    const document = new this.Collection(body);

    return document.save();
  }

  async findOneAndUpdate(conditions, update) {
    return this.Collection.findOneAndUpdate(conditions, update, {
      new: true
    });
  }

  async save(body) {
    const doc = await this.find({
      name: body.name,
      owner: body.owner
    }, false);
    if (doc && doc.length === 0) {
      return this.create(body);
    }
    return this.findOneAndUpdate({
      _id: doc[0].id
    }, body);
  }
}

module.exports = BaseRepository;
