const async = require('async')
const path = require('path')
const fs = require('fs')

module.exports = new class {
  constructor() {
    this.services = {};
  }
  init(cb) {
    this.loadServices(err => {
      this.initServices(err => {
        return cb();
      });
    });
  }
  loadServices(cb) {
    fs.readdir(path.join(__dirname, '../api/services/'), (err, files_names) => {
      async.each(files_names, (file_name, next) => {
        let file_path = path.join(__dirname, '../api/services/', file_name);
        let service_name = file_name.split('.')[0];
        this.services[service_name] = require(file_path);
        return next();
      }, cb);
    });
  }
  initServices(cb) {
    for (let service_name in this.services) {
      global[service_name] = this.services[service_name];
    }
    return cb();
  }
}
