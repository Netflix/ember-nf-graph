/* global require, module */
var mergeTrees = require('broccoli-merge-trees');
var scssCompile = require('broccoli-sass');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var exportTree = require('broccoli-export-tree');
var pickFiles = require('broccoli-static-compiler');
var sassImageCompiler = require('broccoli-sass-image-compiler');

var appTree = mergeTrees(['app', 'app-addon'], { overwrite: true });

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
	destDir: 'vendor-addon/ember-cli-ember-dvc', 
	clobber: true
});

var app = new EmberApp({
	trees: {
		vendor: mergeTrees(['vendor', 'vendor-addon']),
		app: appTree,
		templates: mergeTrees(['app-addon/templates', 'app/templates'])
	}
});


app.import('vendor/d3/d3.js');
app.import('vendor/ember-cli-ember-dvc/ember-cli-ember-dvc.css');
app.import('vendor/ember-handlebars-svg/ember-handlebars-svg.js');

module.exports = mergeTrees([exportedCss, app.toTree()]);
