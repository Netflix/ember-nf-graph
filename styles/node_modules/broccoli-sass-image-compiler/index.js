/**
 *	broccoli-sass-image-compiler
 *  ©2014 Ben Lesh <ben@benlesh.com>
 *  MIT License <https://github.com/blesh/broccoli-sass-image-compiler/blob/master/LICENSE.txt>
 */

var Writer = require('broccoli-writer');
var DataURI = require('datauri');
var helpers = require('broccoli-kitchen-sink-helpers');
var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var imageSize = require('image-size');
var util = require('util');

function ImageCompiler(inputTree, options){
	if(!(this instanceof ImageCompiler)) {
		return new ImageCompiler(inputTree, options);
	}
	
	options = options || {};
	
	this.inputTree = inputTree;

	for(var key in options) {
		if(options.hasOwnProperty(key)) {
			this[key] = options[key];
		}
	}
}

ImageCompiler.prototype.constructor = ImageCompiler;

ImageCompiler.prototype = Object.create(Writer.prototype);

ImageCompiler.prototype.iconClass = 'icon';
ImageCompiler.prototype.size = true;
ImageCompiler.prototype.icon = true;

ImageCompiler.prototype._createOutput = function(srcDir){
	var self = this;

	var inputFiles = helpers.multiGlob(self.inputFiles, { 
		cwd: srcDir
	});

	return inputFiles.reduce(function(output, filename) {
		var filepath = path.resolve(srcDir, filename);
		var dataUri = new DataURI(filepath);
		var uri = dataUri.content;
		var varname = path.basename(filepath, path.extname(filepath));
		output += util.format('$%s: "%s";\n', varname, dataUri.content);

		if(self.size || self.icon) {
			var size = imageSize(filepath);
			output += util.format('$%s_width: %dpx;\n', varname, size.width);
			output += util.format('$%s_height: %dpx;\n', varname, size.height);

			if(self.icon) {
				var iconClassFormat = '.%s.%s {\n' +
					'  background-repeat: once;\n' + 
					'  display: inline-block;\n\n' +
					'  background-image: url($%s);\n' + 
					'  background-repeat: once;\n' +
					'  width: $%s_width;\n' + 
					'  height: $%s_width;\n' +
					'}\n\n';

				output += util.format(iconClassFormat, self.iconClass, varname, varname, varname, varname);
			}
		}

		return output;
	}, '');
};

ImageCompiler.prototype.write = function(readTree, destDir) {
	var self = this;

	return readTree(self.inputTree).then(function(srcDir) {
		var output = self._createOutput(srcDir);
    helpers.assertAbsolutePaths([self.outputFile]);
    mkdirp.sync(path.join(destDir, path.dirname(self.outputFile)));
    fs.writeFileSync(path.join(destDir, self.outputFile), output, 'utf8');
	});
};

module.exports = ImageCompiler;