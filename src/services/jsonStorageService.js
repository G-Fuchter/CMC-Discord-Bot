const fs = require("fs/promises");

class JsonStorageService {
  constructor(fileName) {
    this.fileName = fileName;
  }

  initialize = async () => {
    const rawData = await fs.readFile(`${__dirname}/../data/${this.fileName}`);
    this.arrayData = JSON.parse(rawData);
    this.dictionaryData = this._createDictionaryUsingIds(this.arrayData);
  };

  getObjectWithId = (id) => {
    try {
      return this.dictionaryData[id];
    }
    catch(err) {
      return null;
    }
  };

  saveObject = async (objectToSave) => {
    this.arrayData.push(objectToSave);
    this.dictionaryData[objectToSave.id] = objectToSave;
    const data = JSON.stringify(this.arrayData);
    await fs.writeFile(`${__dirname}/../data/${this.fileName}`, data);
  };

  _createDictionaryUsingIds = (arrayData) => {
    const dictionary = {};
    arrayData.forEach((data) => {
      dictionary[data.id] = data;
    });
    return dictionary;
  };
}

module.exports = JsonStorageService;
