require('dotenv').config();
const saucelabs = require('./saucelabs');

module.exports = (config) => {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.')
    process.exit(1)
  }
  config.set({
    frameworks: ['browserify', 'mocha', 'chai'],
    files: [
      'lib/**/*.js',
      'test/*.js'
    ],
    browserify: {
      debug: true,
      transform: [
        ['babelify']
      ]
    },
    preprocessors: {
      'lib/**/*.js': ['browserify'],
      'test/**/*.js': ['browserify'],
    },
    reporters: ['progress', 'saucelabs'],
    port: 9876,
    colors: true,
    captureTimeout: 120000,
    sauceLabs: {
      testName: 'Web App Unit Tests',
      tunnelIdentifier: 'demo',
      recordScreenshots: false,
      connectOptions: {
        port: 5757,
        logfile: 'sauce_connect.log'
      },
      public: 'public'
    },
    customLaunchers: saucelabs,
    browsers: Object.keys(saucelabs),
    singleRun: true
  });
}
