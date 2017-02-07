const async = require('async')
const fse = require('fs-extra')
const path = require('path')

module.exports = class EGenerator {
  static get base_path() {
    return process.cwd()
  }
  static get default_path() {
    return path.join(__dirname, '../default')
  }
  static get folders() {
    return [
      'config',
      'api/controllers',
      'api/models',
      'api/middlewares',
      'api/services'
    ]
  }
  static init(cb) {
    async.each(EGenerator.folders, (folder, next) => {
      const args = [
        path.join(EGenerator.default_path, folder),
        path.join(EGenerator.base_path, folder),
      ]
      fse.copySync(...args, { overwrite : false })
      return next()
    }, cb)
  }
}
