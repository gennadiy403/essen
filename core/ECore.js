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
    this.essen = {
      app: express(),
      path: process.cwd(),
    }
  }
  start() {
    this.loadPlugins(err => {
      if (err) return log.error(err)
      EConfigurator.init(this.essen.path, (err, config) => {
        log.level = config.log.level
        if (err) return log.err(err)
        log.debug('config loaded')
        this.essen = Object.assign(this.essen, config)
        EMiddleware.init(this.essen, err => {
          if (err) log.err(err)
          log.debug('middlewares inited')
          EORM.init(err => {
            if (err) log.err(err)
            log.debug('ORM models inited')
            EServiceman.init(this.essen, err => {
              if (err) log.err(err)
              log.debug('services inited')
              this.bootstrap(err => {
                if (err) log.err(err)
                log.debug('bootstrap executed')
                this.initRouter(err => {
                  if (err) log.err(err)
                  log.debug('routes inited')
                  this.startServer()
                });
              });
            });
          });
        });
      });
    });
  }
  loadPlugins(cb) {
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
    return cb();
  }
  bootstrap(cb) {
    const config_path = path.join(essen.path, 'config/bootstrap.js');
    const bootstrap = require(config_path);
    bootstrap(cb);
  }
  initRouter(cb) {
    const router = new ERouter(this.essen);
    router.init(cb);
  }
  startServer() {
    this.essen.app.listen(this.essen.server.port, err => {
      if (err) log.err(err);
      log.info(`${this.essen.server.name} listening on port ${this.essen.server.port}`);
      log.info(`using db ${this.essen.db.name} at ${this.essen.db.host}`);
    });
  }
}
