const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const exec = require('child_process').exec

module.exports = class ECli {
  static init(argv) {
    ECli.command = argv[2]
    ECli.path = path.join(__dirname, '../templates/default')
    ECli.dest = path.join(process.cwd(), argv[3])
    switch(ECli.command) {
      case 'create':
        ECli.create()
        break;
      default:
        console.log(`Unknown command ${ECli.command}`)
    }
  }
  static create() {
    fse.ensureDir(ECli.dest, err => {
      fs.readdir(ECli.dest, (err, files) => {
        if (files.length) {
          console.log(`Directory ${ECli.dest} is not empty`)
        } else {
          fse.copySync(path.join(ECli.path, 'package.json'), path.join(ECli.dest, 'package.json'))
          fse.copySync(path.join(ECli.path, 'api'), path.join(ECli.dest, 'api'))
          fse.copySync(path.join(ECli.path, 'config'), path.join(ECli.dest, 'config'))
          fse.copySync(path.join(ECli.path, 'app.js'), path.join(ECli.dest, 'app.js'))
          process.chdir(ECli.dest)
          exec('npm install', (err, stdout, stderr) => {
            console.log(`essen empty project successfully cteated at ${ECli.dest}`)            
          }).stderr.pipe(process.stderr)
        }
      })
    })
  }
}
