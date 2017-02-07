# Essen.js
Inspired by Sails.js, powered by Express.js

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

## Install

```bash
$ npm install essen -g
$ essen create project_name
```

## Run
```bash
$ cd project_name
$ node app.js
```

## Configure
  * `config/server.js` - server config. Change port and name for your app  
  * `config/db.js` - DB config. Change host and DB name for your mongoDB  
  * `config/bootstrap.js` - code inside this module will be executed before HTTP server starts  
  * `config/routes.js` - Router config. Configure your routes as you wish  
  * `config/log.js` - Logger config. Only level option here
  * `config/middlewares.js` - Middlewares config. Use this array to push your own middlewares. Position on array means middleware position on request
  * `config/env.js` - Environment configs. Configure DB and server for each NODE_ENV
  * `api/controllers` - controllers directory. Check `IndexController.js` for example  
  * `api/models` - models directory. Check `UserModel.js` for example  
  * `api/middlewares` - middlewares directory. Check some of them, it's simple Express middlewares

## Features
  * Quick start
  * Centalized routing
  * Human style controllers
  * Human style models
  * Human style custom middlewares
  * Environment configs

## TODO
  * Core errors handling
  * Core refactoring
  * Custom security policies
  * Socket.io support

## License
  [ISC](LICENSE)

[npm-image]: https://img.shields.io/npm/v/essen.svg
[npm-url]: https://npmjs.org/package/essen
[downloads-image]: https://img.shields.io/npm/dm/essen.svg
[downloads-url]: https://npmjs.org/package/essen
