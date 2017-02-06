# Essen.js
Minimalistic essential backend framework

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

```javascript
const Essen = require('essen')
const server = new Essen()

server.start()
```

## Installation

```bash
$ npm init -y
$ npm install essen --save
```

## Run
```bash
$ node app.js
```
After first run, Essen.js creates `api/` and `config/` folders in your
project directory

## Configure
  * `config/server.js` - server config. Change port and name for your app  
  * `config/db.js` - DB config. Change host and DB name for your mongoDB  
  * `config/bootstrap.js` - code inside this module will be executed before HTTP server starts  
  * `config/routes.js` - Router config. Configure your routes as you wish  
  * `config/env.js` - not working (in development)
  * `api/controllers` - controllers directory. Check `IndexController.js` for example  
  * `api/models` - models directory. Check `UserModel` for example

## Features
  * Centalized routing
  * Human style controllers
  * Human style models
  * Quick start

## TODO
  * Environment configs support `config/env.js`
  * Core refactoring
  * Custom security policies
  * Custom middlewares
  * Socket.io support

## License
  [ISC](LICENSE)

[npm-image]: https://img.shields.io/npm/v/essen.svg
[npm-url]: https://npmjs.org/package/essen
[downloads-image]: https://img.shields.io/npm/dm/essen.svg
[downloads-url]: https://npmjs.org/package/essen
