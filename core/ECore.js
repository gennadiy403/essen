/* global log essen */

const EConfigurator = require('./EConfigurator')
const EMiddleware = require('./EMiddleware')
const EORM = require('./EORM.js')
const ERouter = require('./ERouter.js')
const EServiceman = require('./EServiceman.js')

const express = require('express')
const winston = require('winston')
const async = require('async')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')

module.exports = class EServer {
  constructor() {
  let path_dir = process.argv[1].split('/')
  path_dir.pop()
  path_dir = path_dir.join('/')
    this.essen = {
      app: express(),
      path: path_dir,
    }
  }
  start() {
    this.loadPlugins()
    .then(resolve => {
      return this.initConfig(this)
    })
    .then(resolve => {
      return this.initMiddleware(this)
    })
    .then(resolve => {
      return this.initEORM(this)
    })
    .then(resolve => {
      return this.initEserviceman(this)
    })
    .then(resolve => {
      return this.bootstrap(this)
    })
    .catch(err => {
      console.log('reject');
    })
  }
  loadPlugins() {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          global.essen = this.essen;
          global.log = new (winston.Logger)({
            transports: [
              new (winston.transports.Console)({
                colorize: true,
                timestamp: () => new Date().toTimeString().split(' ')[0],
                formatter(options) {
                  return options.timestamp()
                    + ' - '
                    + winston.config.colorize(options.level, options.level.toUpperCase())
                    + ' - '
                    + (options.message ? options.message : '')
                    + (options.meta && Object.keys(options.meta).length ? '\n' + JSON.stringify(options.meta, null, 2) : '' );
                },
              }),
            ],
          });
          global.log.level = 'silly';
          log.debug('Plugins loaded')
        })
        return resolve()
      } catch(err) {
        return reject(err)
      }

    })
  }
  initConfig(context) {
    return new Promise((resolve, reject) => {
      EConfigurator.init(context.essen.path, (err, config) => {
        if (err) {
          log.error('config load error')
          reject(err)
        } else {
          log.level = config.log.level
          context.essen = Object.assign(context.essen, config)
          log.debug('config loaded')
          resolve()
        }
      })
    })
  }
  initMiddleware(context) {
    return new Promise((resolve, reject) => {
      EMiddleware.init(context.essen, err => {
        if (err) {
          log.error('middlewares init error', err)
          reject(err)
        } else {
          log.debug('middlewares inited')
          resolve()
        }
      })
    })
  }
  initEORM(context) {
    return new Promise((resolve, reject) => {
      EORM.init(err => {
        if (err) {
          log.error('ORM models init error')
          reject()
        } else {
          log.debug('ORM models inited')
          resolve()
        }
      })
    })
  }
  initEserviceman(context) {
    return new Promise((resolve, reject) => {
      EServiceman.init(this.essen, err => {
        if (err) {
          log.debug('services init error')
          reject()
        } else {
          log.debug('services inited')
          resolve()
        }
      })
    })
  }
  bootstrap(context) {
    return new Promise((resolve, reject) => {
      try {
        const config_path = path.join(essen.path, 'config/bootstrap.js');
        const bootstrap = require(config_path);
        log.debug('bootstrap executed')
        resolve()
      } catch(err) {
        log.debug('bootstrap execute error')
        reject()
      }
    })
  }
  initRouter(context) {
    return new Promise((resolve, reject) => {
      console.log(context.essen);
      try {
        const router = new ERouter(context.essen);
        router.init(() => {
          log.debug('routes inited')
          resolve()
        })
      } catch(err) {
        log.error('routes init error')
        reject()
      }
    })
  }
  startServer(context) {
    console.log('start!!');
    return new Promise((resolve, reject) => {
      context.essen.app.listen(context.essen.server.port, err => {
        if (err) {
          log.err('start server error');
          reject()
        } else {
          log.info(`${context.essen.server.name} listening on port ${context.essen.server.port}`);
          log.info(`using db ${context.essen.db.name} at ${context.essen.db.host}`);
          resolve()
        }
      });
    })
  }
}
