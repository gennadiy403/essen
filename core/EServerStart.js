EServerStart = (essen) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      essen.app.listen(essen.server, err => {
        if (err) reject(`start server error ${err}`)
        log.info(`${essen.server.name} listening on port ${essen.server.port}`);
        log.info(`using db ${essen.db.name} at ${essen.db.host}`);
        resolve()
      });
    })
  })
}

module.exports = EServerStart;
