const waitOn = require('wait-on');
const {spawn} = require('child_process');
const path = require('path');

let serverPid = null;
const serverPort = '13370';

module.exports = {
  async before() {
    // serve --listen 13370 ./test-app
    serverPid = spawn(path.resolve('node_modules/.bin/serve'), ['--listen', serverPort, '--no-request-logging', './test-app'], {
      cwd: process.cwd(),
      stdio: 'inherit'
    }).pid;

    await waitOn({
      resources: [`http://localhost:${serverPort}`]
    });
  },

  after() {
    if (serverPid) {
      process.kill(serverPid);
    }
  }
}