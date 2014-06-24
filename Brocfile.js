/* global require, module */
var mergeTrees = require('broccoli-merge-trees');
var scssCompile = require('broccoli-sass');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var exportTree = require('broccoli-export-tree');
var pickFiles = require('broccoli-static-compiler');

var appTree    = mergeTrees(['app', 'app-addon'], { overwrite: true });

var compiledCss = scssCompile(['styles-addon'], 'main.scss', 'ember-cli-ember-dvc.css');

var exportedCss = exportTree(compiledCss, {
	destDir: 'vendor-addon/ember-cli-ember-dvc', 
	clobber: true
});

var app = new EmberApp({
	trees: {
		vendor: mergeTrees(['vendor', 'vendor-addon']),
		app: appTree
	}
});


app.import('vendor/d3/d3.js');
app.import('vendor/ember-cli-ember-dvc/ember-cli-ember-dvc.css');

module.exports = mergeTrees([exportedCss, app.toTree()]);
