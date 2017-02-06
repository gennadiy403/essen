const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')
const async = require('async')

module.exports = class EMiddleware {
  static init(essen, cb) {
    EMiddleware.essen = essen
    EMiddleware.loadDefaultMiddlewares(err => {
      EMiddleware.loadCustomMiddlewares(err => {
        return cb()
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
        EMiddleware.essen.app.use(require(file_path))
        return next()
      }, cb)
    })
  }
}
