/* global log essen */

const express = require('express');
const Generator = require('./Generator');
const ORM = require('./ORM.js');
const Router = require('./Router.js');
const Serviceman = require('./Serviceman.js');
const bodyParser = require('body-parser');
const winston = require('winston');

const async = require('async');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

class Server {
  constructor() {
    this.essen = {};
    this.essen.app = express();
  }
  start() {
    this.loadPlugins(err => {
      if (err) log.error(err);
      Generator.init(err => {
        if (err) log.error(err)
        log.debug('plugins loaded');
        this.loadConfig(err => {
          if (err) log.err(err);
          log.debug('config loaded');
          this.initMiddlewares(err => {
            if (err) log.err(err);
            log.debug('middlewares inited');
            this.initORM(err => {
              if (err) log.err(err);
              log.debug('ORM models inited');
              this.initServices(err => {
                if (err) log.err(err);
                log.debug('services inited');
                this.bootstrap(err => {
                  if (err) log.err(err);
                  log.debug('bootstrap executed');
                  this.initRouter(err => {
                    if (err) log.err(err);
                    log.debug('routes inited');
                    this.startServer();
                  });
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
    global.log.level = 'debug';
    return cb();
  }
  loadConfig(cb) {
    this.essen.server = {
      port: 1440,
      name: 'essen server',
    };
    this.essen.db = {
      host: 'localhost',
      name: 'essen',
    };
    this.essen.path = process.cwd();
    const server_config_path = path.join(this.essen.path, 'config/server.js');
    const db_config_path = path.join(this.essen.path, 'config/db.js');
    const path_config_path = path.join(this.essen.path, 'config/path.js');
    try {
      Object.assign(this.essen.server, require(server_config_path));
      Object.assign(this.essen.db, require(db_config_path));
      Object.assign(this.essen.path, require(path_config_path));
    } catch (err) {
      log.error(err);
      cb();
    } finally {
      cb();
    }
  }
  initMiddlewares(cb) {
    this.essen.app.use(bodyParser.urlencoded({ extended: false }));
    this.essen.app.use(bodyParser.json());
    this.essen.app.use(express.static(path.join(this.essen.path, 'dist')));
    return cb();
  }
  initORM(cb) {
    ORM.init(cb);
  }
  initServices(cb) {
    Serviceman.init(cb);
  }
  bootstrap(cb) {
    const config_path = path.join(essen.path.base, 'config/bootstrap.js');
    const bootstrap = require(config_path);
    bootstrap(cb);
  }
  initRouter(cb) {
    const router = new Router(this.essen);
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

module.exports = Server;
