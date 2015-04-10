var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf');
var CachingWriter = require('broccoli-caching-writer');
var helpers = require('broccoli-kitchen-sink-helpers')

ExportTree.prototype = Object.create(CachingWriter.prototype);
ExportTree.prototype.constructor = ExportTree;
function ExportTree (inputTree, options) {
  if (!(this instanceof ExportTree)) return new ExportTree(inputTree, options);

  options = options || {};
  this.inputTree = inputTree;

  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this[key] = options[key]
    }
  }

  if (this.clobber === undefined) { this.clobber   = true; }
};

ExportTree.prototype.updateCache = function (srcDir, destDir) {
  if (this.clobber) {
    rimraf.sync(this.destDir);
  }

  helpers.copyRecursivelySync(srcDir, this.destDir);
};

module.exports = ExportTree;
