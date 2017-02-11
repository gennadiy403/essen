const _ = require('underscore')
const fs = require('fs')
const fse = require('fs-extra')
const express = require('express')
const path = require('path')

module.exports = class EConfigurator {
  static init(essen) {
    return new Promise((resolve, reject) => {
      EConfigurator.path = path.join(essen.path, 'config')
      EConfigurator.readConfigs((err, config) => {
        if (err) reject('EConfigurator error', err)
        log.level = config.log.level
        essen = Object.assign(essen, config)
        log.debug('config loaded')
        resolve()
      })
    })
  }
  static readConfigs(cb) {

    let config = {}
    config.db = require(path.join(EConfigurator.path, 'db.js'))
    config.server = require(path.join(EConfigurator.path, 'server.js'))
    config.log = require(path.join(EConfigurator.path, 'log.js'))
    config.middlewares = require(path.join(EConfigurator.path, 'middlewares.js'))
    fs.readdir(EConfigurator.path, (err, files) => {
      if (files.includes('env.js')) {
        let env_config = require(path.join(EConfigurator.path, 'env.js'))
        env_config = env_config[process.env.NODE_ENV] ? env_config[process.env.NODE_ENV] : {}
        config.db = _.extend(config.db, env_config.db ? env_config.db : {})
        config.server = _.extend(config.server, env_config.server ? env_config.server : {})
        config.log = _.extend(config.log, env_config.log ? env_config.log : {})
        config.middlewares = _.extend(config.middlewares, env_config.middlewares ? env_config.middlewares : {})
        return cb(null, config)
      } else {
        return cb(null, config)
      }
    })
  }
}
