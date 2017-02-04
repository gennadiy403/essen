class Router {
  constructor(essen) {
    this.essen = essen;
    this.controllers = {};
    this.routes = {};
  }
  init(cb) {
    this.loadControllers(() => {
      this.loadRoutes();
      this.listenRoutes();
      return cb();
    });
  }
  loadControllers(cb) {
    fs.readdir(path.join(this.essen.path, 'api/controllers'), (err, files_names) => {
      async.each(files_names, (file_name, next) => {
        let controller_name = file_name.split('.')[0];
        let file_path = path.join(this.essen.path, 'api/controllers/', file_name);
        this.controllers[controller_name] = require(file_path);
        return next();
      }, cb);
    });
  }
  loadRoutes() {
    this.routes = require(path.join(this.essen.path, 'config/routes.js'));
  }
  listenRoutes() {
    for (let url in this.routes) {
      let route = this.routes[url];
      try {
        this.essen.app[route.method.toLowerCase()](url, this.controllers[route.controller][route.action]);
      } catch(e) {
        log.error(`essen cant find valid controller for route ${url}, ignoring`)
      }
    }
  }
}

module.exports = Router
