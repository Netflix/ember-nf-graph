/* global require, module */
var mergeTrees = require('broccoli-merge-trees');
var scssCompile = require('broccoli-sass');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var exportTree = require('broccoli-export-tree');

var appTree    = mergeTrees(['app', 'app-addon'], { overwrite: true });
var vendorTree = mergeTrees(['vendor', 'vendor-addon']);

var app = new EmberApp({
	trees: {
		vendor: vendorTree,
		app: appTree
	}
});

var cssTree = scssCompile(['styles-addon'], 'main.scss', 'ember-cli-ember-dvc.css');
// var outputCss = (cssTree, {
// 	destDir: '/'
// });

app.import('vendor/d3/d3.js');
app.import('vendor-addon/ember-cli-ember-dvc/ember-cli-ember-dvc.css');

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

var wat = exportTree(cssTree, {
	destDir: 'vendor-addon/ember-cli-ember-dvc', 
	clobber: true
});

module.exports = mergeTrees([app.toTree(), wat]);
