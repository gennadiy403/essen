const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const async = require('async')

module.exports = class EMiddleware {
  static init(essen, cb) {
    EMiddleware.essen = essen
    EMiddleware.uses = {}
    EMiddleware.loadDefaultMiddlewares(err => {
      EMiddleware.loadCustomMiddlewares(err => {
        EMiddleware.initCustomMiddlewares(err => {
          return cb()
        })
      })
    })
  }
  static loadDefaultMiddlewares(cb) {
    EMiddleware.essen.app.use(bodyParser.urlencoded({ extended: false }))
    EMiddleware.essen.app.use(bodyParser.json())
    EMiddleware.essen.app.use(express.static(path.join(EMiddleware.essen.path, 'dist')))
    return cb()
  }
  static loadCustomMiddlewares(cb) {
    const middlewares_path = path.join(EMiddleware.essen.path, 'api/middlewares')
    fs.readdir(middlewares_path, (err, files) => {
      async.each(files, (file, next) => {
        const file_path = path.join(middlewares_path, file)
        const middleware_name = file.split('.')[0]
        EMiddleware.uses[middleware_name] = file_path
        // EMiddleware.essen.app.use(require(file_path))
        return next()
      }, cb)
    })
  }
  static initCustomMiddlewares(cb) {
    async.each(EMiddleware.essen.middlewares, (middleware, next) => {
      EMiddleware.essen.app.use(require(EMiddleware.uses[middleware]))
      return next()
    }, cb)
  }
}
