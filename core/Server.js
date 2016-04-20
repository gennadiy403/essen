'use strict';
var express   = require('express'),
    fs        = require('fs'),
    path      = require('path');

class Server {
  constructor(settings, parent, global) {
    this.settings = settings;
    this.parent   = parent;
    this.global   = global;
    this.express  = express();
  }
  start() {
    this.express.listen(this.settings.port, () => {
      console.log('ESSEN HTTP server listen on port ' + this.settings.port);
      this.loadControllers();
      this.listenRoutes();
    });
  }
  listenRoutes() {
    this.routes = require(path.join(this.parent.appPath, 'config', 'routes.js'));
    for (let route in this.routes) {
      if (this.routes.hasOwnProperty(route)) {
        if (this.routes[route].method == 'get') {
          console.log('ESSEN listen new GET route: ' + route);
          this.express.get(route, (req, res) => {
            this.controllers[this.routes[route].controller][this.routes[route].action](req, res);
          });
        }
        if (this.routes[route].method == 'post') {
          console.log('ESSEN listen new POST route: ' + route);
          this.express.post(route, (req, res) => {
            this.controllers[this.routes[route].controller][this.routes[route].action](req, res);
          });
        }
      }
    }
  }
  loadControllers() {
    this.controllers = {};
    fs.readdir(path.join(this.parent.appPath, 'controllers/'), (err, controllersFilesNames) => {
      for (let controllerFileName of controllersFilesNames) {
        let controllerName = controllerFileName.slice(0, controllerFileName.length - 3);
        this.controllers[controllerName] = require(path.join(this.parent.appPath, 'controllers', controllerFileName));
      }
    });
  }
}

module.exports = Server;