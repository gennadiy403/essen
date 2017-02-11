const winston = require('winston')
EPluginsLoader = (essen) => {
  return new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        global.essen = this.essen;
        global.log = new (winston.Logger)({
          transports: [
            new (winston.transports.Console)({
              colorize: true,
              timestamp: () => new Date().toTimeString().split(' ')[0],
              formatter(options) {
                return options.timestamp()
                  + ' - '
                  + winston.config.colorize(options.level, options.level.toUpperCase())
                  + ' - '
                  + (options.message ? options.message : '')
                  + (options.meta && Object.keys(options.meta).length ? '\n' + JSON.stringify(options.meta, null, 2) : '' );
              },
            }),
          ],
        });
        global.log.level = 'silly';
        log.debug('Plugins loaded!')
        return resolve(log)
      })
    } catch(err) {
      return reject(`Plugins load error ${err}`)
    }
  })
}

module.exports = EPluginsLoader;
