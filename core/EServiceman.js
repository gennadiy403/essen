const async = require('async')
const path = require('path')
const fs = require('fs')

module.exports = class EServiceman {
  static init(essen, cb) {
    EServiceman.path = path.join(essen.path, 'api/services')
    EServiceman.loadServices(err => {
      if (err) return cb(err)
      return cb()
    })
  }
  static loadServices(cb) {
    fs.readdir(EServiceman.path, (err, files_names) => {
      async.each(files_names, (file_name, next) => {
        let file_path = path.join(EServiceman.path, file_name)
        let service_name = file_name.split('.')[0]
        global[service_name] = require(file_path)
        return next()
      }, cb)
    })
  }
}
