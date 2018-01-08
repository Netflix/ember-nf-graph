exports.config = {
  directConnect: true,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      //Important for benchpress to get timeline data from the browser
      'args': ['--js-flags=--expose-gc'],
      'perfLoggingPrefs': {
        'traceCategories': 'blink.console,disabled-by-default-devtools.timeline'
      }
    },
    loggingPrefs: {
      performance: 'ALL'
    }
  },

  specs: ['tests/perf/**/*.spec.js'],

  framework: 'jasmine2',

  // onCleanUp: function() {
  //   console.log("KILLED");
  //   emberProcess.kill();
  // },

  // onPrepare: function() {
  //   // open a new browser for every benchmark
  //   var originalBrowser = browser;
  //   var _tmpBrowser;
  //   beforeEach(function() {
  //     global.browser = originalBrowser.forkNewDriverInstance();
  //     global.element = global.browser.element;
  //     global.$ = global.browser.$;
  //     global.$$ = global.browser.$$;
  //   });
  //   afterEach(function() {
  //     global.browser.quit();
  //     global.browser = originalBrowser;
  //   });
  // },

  restartBrowserBetweenTests: true,

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },
};
