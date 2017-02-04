/* global log */

const async = require('async')
const fse = require('fs-extra')
const path = require('path')

module.exports = class Generator {
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
    ]
  }
  static init(cb) {
    async.each(Generator.folders, (folder, next) => {
      const args = [
        path.join(Generator.default_path, folder),
        path.join(Generator.base_path, folder),
      ]
      fse.copySync(...args, { overwrite : false })
      return next()
    }, cb)
  }
}
