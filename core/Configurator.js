const _ = require('underscore')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

module.exports = class Configurator {
  static init(base_path, cb) {
    Configurator.path = path.join(base_path, 'config')
    Configurator.readConfigs((err, config) => {
      return cb(null, config)
    })
  }
  static readConfigs(cb) {
    let config = {}
    config.db = require(path.join(Configurator.path, 'db.js'))
    config.server = require(path.join(Configurator.path, 'server.js'))
    fs.readdir(Configurator.path, (err, files) => {
      if (files.includes('env.js')) {
        let env_config = require(path.join(Configurator.path, 'env.js'))
        env_config = env_config[process.env.NODE_ENV] ? env_config[process.env.NODE_ENV] : {}
        config.db = _.extend(config.db, env_config.db ? env_config.db : {})
        config.server = _.extend(config.server, env_config.server ? env_config.server : {})
        return cb(null, config)
      } else {
        return cb(null, config)
      }
    })
  }
}
