module.exports = {
  development: {
    db: {
      host: 'localhost',
      name: 'essen'
    },
    server: {
      port: 10000,
      name: 'essen-development'
    }
  },
  production: {
    db: {
      host: 'localhost',
      name: 'essen'
    },
    server: {
      port: 20000,
      name: 'essen-production'
    }
  }
}
