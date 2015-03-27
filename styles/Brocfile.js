/* jshint node: true */
/* global require, module */

var mergeTrees = require('broccoli-merge-trees');
var scssCompile = require('broccoli-sass');
// var exportTree = require('broccoli-export-tree');
var sassImageCompiler = require('broccoli-sass-image-compiler');


var imageTree = sassImageCompiler('images', {
	inputFiles: ['*.png'],
	outputFile: '/scss/compiled-images.scss',
	iconClass: 'nf-icon',
	size: true,
	icon: true
});

var stylesTree = mergeTrees(['scss', imageTree]);

var compiledCss = scssCompile([stylesTree], 'main.scss', 'ember-cli-nf-graph.css');

// var exportedCss = exportTree(compiledCss, {
// 	destDir: 'ember-cli-nf-graph', 
//  	clobber: true
// });


module.exports = compiledCss;
