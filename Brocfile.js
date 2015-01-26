/* jshint node: true */
/* global require, module */

var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var mergeTrees = require('broccoli-merge-trees');
var scssCompile = require('broccoli-sass');
var exportTree = require('broccoli-export-tree');
var sassImageCompiler = require('broccoli-sass-image-compiler');

var app = new EmberAddon();

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

var imageTree = sassImageCompiler('images', {
	inputFiles: ['*.png'],
	outputFile: '/compiled-images.scss',
	iconClass: 'nf-icon',
	size: true,
	icon: true
});

var stylesTree = mergeTrees(['styles-addon', imageTree]);

var compiledCss = scssCompile([stylesTree], 'main.scss', 'ember-cli-ember-dvc.css');

var exportedCss = exportTree(compiledCss, {
	destDir: 'vendor/ember-cli-ember-dvc', 
	clobber: true
});



app.import(app.bowerDirectory + '/d3/d3.js');
app.import(app.bowerDirectory + '/d3mber/d3mber.js');
app.import('vendor/ember-cli-ember-dvc/ember-cli-ember-dvc.css');
//app.import('vendor/ember-handlebars-svg/ember-handlebars-svg.js');

module.exports = mergeTrees([exportedCss, app.toTree()]);
