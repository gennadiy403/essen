#!/usr/bin/env node

if (require.main === module) {
  const ECli = require('./core/ECli.js')
  ECli.init(process.argv)
} else {
  const ECore = require('./core/ECore.js')
  module.exports = ECore
}
