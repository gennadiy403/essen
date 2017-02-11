const express = require('express')
const path = require('path')

module.exports = class EBootstrapLoader {
  static init(essen) {
    return new Promise((resolve, reject) => {
      try {
        setTimeout(() => {
          const config_path = path.join(essen.path, 'config/bootstrap.js');
          const bootstrap = require(config_path);
          log.debug('bootstrap executed')
          resolve()
        })
      } catch(err) {
        reject('bootstrap execute error')
      }
    })
  }
}
