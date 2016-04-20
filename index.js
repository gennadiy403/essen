'use strict';
let path = require('path');

class Essen {
  constructor(appPath) {
    this.appPath  = path.join(__dirname, appPath);
    this.corePath = __dirname;
    this.init();

    let Server  = require('./core/Server.js');
    let Model   = require('./core/Model.js');

    this.server = new Server(this.settings.server, this, global);
    this.server.start();
    // this.model  = new Model(this.settings.db, this, global);
  }
  init() {
    this.settings = require(path.join(this.appPath, 'config/settings'));
  }
}

module.exports = Essen;