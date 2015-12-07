/* jshint node: true */
/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
    var app = new EmberApp(defaults, {
        // Any other options
    });

    app.import('bower_components/ember/ember-template-compiler.js', { type: 'test' });

    return app.toTree();
};
