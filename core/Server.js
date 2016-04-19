'use strict';
var express   = require('express'),
    fs        = require('fs');

class Server {
  constructor(settings) {
    this.settings = settings;
    this.app      = express();
  }
  start() {
    this.app.listen(this.settings.port, () => {
      console.log('ESSEN HTTP server listen on port ' + this.settings.port);
      this.loadControllers();
      this.listenRoutes();
    });
  }
  listenRoutes() {
    this.routes = require('../../../config/routes.js');
    for (let route in this.routes) {
      if (this.routes.hasOwnProperty(route)) {
        if (this.routes[route].method == 'get') {
          console.log('ESSEN listen new GET route: ' + route);
          this.app.get(route, (req, res) => {
            this.controllers[this.routes[route].controller][this.routes[route].action](req, res);
          });
        }
        if (this.routes[route].method == 'post') {
          console.log('ESSEN listen new POST route: ' + route);
          this.app.post(route, (req, res) => {
            this.controllers[this.routes[route].controller][this.routes[route].action](req, res);
          });
        }
      }
    }
  }
  loadControllers() {
    this.controllers = {};
    fs.readdir(__dirname + '../../../../controllers/', (err, controllersFilesNames) => {
      for (let controllerFileName of controllersFilesNames) {
        let controllerName = controllerFileName.slice(0, controllerFileName.length - 3);
        this.controllers[controllerName] = require('../../../controllers/' + controllerFileName);
      }
    });
  }
}

module.exports = Server;