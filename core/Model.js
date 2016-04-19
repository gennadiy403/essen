'use strict';

let mongoose = require('mongoose'),
    fs       = require('fs');

class Model {
  constructor(settings) {
    mongoose.connect('mongodb://' + settings.host + '/' + settings.name, err => {
      console.log('FUCK!');
    });
  }
  initModels() {

  }
}

module.exports = Model;