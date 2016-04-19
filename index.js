'use strict';

class Essen {
  constructor() {
    this.init();
    let Server  = require('./core/Server.js');
    let Model   = require('./core/Model.js');
    this.server = new Server(this.settings.server);
    this.model  = new Model(this.settings.db);
  }
  start() {
    this.server.start();
  }
  init() {
    this.settings = require('../../config/settings');
  }
}

module.exports = new Essen();