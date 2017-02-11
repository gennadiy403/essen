/* global log essen */

const EPluginsLoader = require('./EPluginsLoader')
const EConfigurator = require('./EConfigurator')
const EMiddleware = require('./EMiddleware')
const EORM = require('./EORM')
const EServiceman = require('./EServiceman')
const EBootstrapLoader = require('./EBootstrapLoader')
const ERouter = require('./ERouter')
const EServerStart = require('./EServerStart')

const express = require('express')
const async = require('async')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

let path_dir = process.argv[1].split('/')
path_dir.pop()
path_dir = path_dir.join('/')
let essen = {
  app: express(),
  path: path_dir,
}

module.exports = class ECore {
  static start() {
    EPluginsLoader()
      .then(log => {
        Promise.all([
          EConfigurator.init(essen),
          EMiddleware.init(essen),
          EORM.init(essen),
          EServiceman.init(essen),
          EBootstrapLoader.init(essen),
          ERouter.init(essen),
        ]).then(() => {
          EServerStart(essen)
            .catch(err => {
              log.error(err)
            })
        })
      })
  }
}
