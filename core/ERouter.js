const fs = require('fs')
const path = require('path')
const async = require('async')

module.exports = class ERouter {
  constructor(essen) {

  }
  static init(essen) {
    return new Promise((resolve, reject) => {
      ERouter.essen = essen
      ERouter.controllers = {}
      ERouter.routes = {}
      ERouter.loadControllers(essen, () => {
        ERouter.loadRoutes(essen);
        ERouter.listenRoutes(essen);
        log.debug('routes inited')
        resolve()
      });
    })
  }
  static loadControllers(essen, cb) {
    fs.readdir(path.join(essen.path, 'api/controllers'), (err, files_names) => {
      async.each(files_names, (file_name, next) => {
        let controller_name = file_name.split('.')[0];
        let file_path = path.join(essen.path, 'api/controllers/', file_name);
        ERouter.controllers[controller_name] = require(file_path);
        return next();
      }, cb);
    });
  }
  static loadRoutes(essen) {
    ERouter.routes = require(path.join(essen.path, 'config/routes.js'));
  }
  static listenRoutes(essen) {
    for (let url in this.routes) {
      let route = this.routes[url];
      try {
        essen.app[route.method.toLowerCase()](url, this.controllers[route.controller][route.action]);
      } catch(e) {
        log.error(`essen cant find valid controller for route ${url}, ignoring`)
      }
    }
  }
}
