"use strict";

class DataModel {
  constructor() {
    this.name;
    this.about;
    this.topics = [];
    this.languages = [];
    this.license;
    this.contributorsQuantity;
  }
}

class Language {
  constructor(theLanguage) {
    this.name = theLanguage.name;
    this.percent = theLanguage.percent;
  }
}

class Data {
  static data = []; // Too generic???

  static addValue(id, key, value) {
    if (!Data.data[id]) {
      Data.data[id] = new DataModel();
    }

    if (!Data.data[id][key] || Data.data[id][key] instanceof String) {
      Data.data[id][key] = value;
    } else if (Data.data[id][key] instanceof Array) {
      Data.data[id][key].push(value);
    }
  }

  static hasValue(id) {
    return Data.data[id];
  }

  static initValue(id) {
    if (!Data.hasValue(id)) {
      Data.data[id] = new DataModel();
    }
  }

  static setName(id, value) {
    Data.initValue(id);
    Data.data[id]["name"] = value;
  }

  static setAbout(id, value) {
    Data.initValue(id);
    Data.data[id]["about"] = value;
  }

  static addTopic(id, value) {
    Data.initValue(id);
    Data.data[id]["topics"].push(value);
  }

  static addLanguage(id, value) {
    Data.initValue(id);
    Data.data[id]["languages"].push(new Language(value));
  }

  static setLicense(id, value) {
    Data.initValue(id);
    Data.data[id]["license"] = value;
  }

  static setContributorsQuantity(id, value) {
    Data.initValue(id);
    Data.data[id]["contributorsQuantity"] = value;
  }

  static toJSON() {
      const jsonData = [];
      for (const id in Data.data) {
        jsonData[id] = JSON.stringify(Data.data[id]);
      }
      return jsonData;
  }

  static clear() {
    Data.data = [];
  }
}

module.exports = Data;