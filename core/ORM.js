/* global essen log fs path async */

const mongoose = require('mongoose');

module.exports = new class {
  constructor() {
    this.models = {};
  }
  init(cb) {
    this.loadModels(err => {
      if (err) log.error(err);
      this.initModels(err => {
        if (err) log.error(err);
        return cb();
      });
    });
  }
  loadModels(cb) {
    fs.readdir(path.join(essen.path.base, 'api/models/'), (err, files_names) => {
      async.each(files_names, (file_name, next) => {
        const file_path = path.join(essen.path.base, 'api/models/', file_name);
        const model_name = file_name.split('.')[0];
        this.models[model_name] = require(file_path);
        return next();
      }, cb);
    });
  }
  initModels(cb) {
    mongoose.Promise = global.Promise;
    mongoose.connect(`mongodb://${essen.db.host}/${essen.db.name}`);
    for (let model_name in this.models) {
      global[model_name] = this.models[model_name];
    }
    return cb();
  }
};
