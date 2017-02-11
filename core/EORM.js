const async = require('async');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

module.exports = new class {
  constructor() {
    this.models = {};
  }
  init(essen) {
    return new Promise((resolve, reject) => {
      this.loadModels(essen, err => {
        if (err) reject(`ORM models error ${err}`)
        this.initModels(essen, err => {
          if (err) reject('ORM models error', err)
          log.debug('ORM models inited')
          return resolve();
        });
      });
    })
  }
  loadModels(essen, cb) {
    fs.readdir(path.join(essen.path, 'api/models/'), (err, files_names) => {
      async.each(files_names, (file_name, next) => {
        const file_path = path.join(essen.path, 'api/models/', file_name);
        const model_name = file_name.split('Model')[0];
        const schema = require(file_path);
        this.models[model_name] = mongoose.model(model_name, new mongoose.Schema(schema));
        return next();
      }, cb);
    });
  }
  initModels(essen, cb) {
    mongoose.Promise = global.Promise;
    mongoose.connect(`mongodb://${essen.db.host}/${essen.db.name}`);
    for (let model_name in this.models) {
      global[model_name] = this.models[model_name];
    }
    return cb();
  }
};
