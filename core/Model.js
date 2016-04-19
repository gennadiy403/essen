'use strict';

let mongoose = require('mongoose'),
    fs       = require('fs');

class Model {
  constructor(settings, parent) {
    this.parent = parent;
    mongoose.connect('mongodb://' + settings.host + '/' + settings.name, err => {
      console.log('FUCK!');
    });
  }
  initModels() {
    fs.readdir(__dirname + '../../../../models/', (err, modelsFilesNames) => {
      for (let modelFileName of modelsFilesNames) {
        let modelName = modelFileName.slice(0, modelFileName.length - 3),
            modelObj  = require('../../../models/' + modelFileName),
            schema    = new mongoose.Schema(modelObj.schema, modelObj.collection);
            this.global[modelName] = mongoose.model(modelName, schema);
      }
    });
  }
}

module.exports = Model;