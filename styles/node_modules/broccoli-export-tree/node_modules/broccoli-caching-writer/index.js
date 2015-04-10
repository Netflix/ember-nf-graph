var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp')
var quickTemp = require('quick-temp')
var Writer = require('broccoli-writer');
var helpers = require('broccoli-kitchen-sink-helpers')

CachingWriter.prototype = Object.create(Writer.prototype);
CachingWriter.prototype.constructor = CachingWriter;
function CachingWriter (inputTree, options) {
  if (!(this instanceof CachingWriter)) return new CachingWriter(inputTree, options);

  this.inputTree = inputTree;

  options = options || {};

  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      this[key] = options[key]
    }
  }
};

CachingWriter.prototype.getCacheDir = function () {
  return quickTemp.makeOrReuse(this, 'tmpCacheDir')
}

CachingWriter.prototype.getCleanCacheDir = function () {
  return quickTemp.makeOrRemake(this, 'tmpCacheDir')
}

CachingWriter.prototype.write = function (readTree, destDir) {
  var self = this

  return readTree(this.inputTree).then(function (srcDir) {
    var inputTreeHash = helpers.hashTree(srcDir);

    if (inputTreeHash !== self._cacheHash) {
      self.updateCache(srcDir, self.getCleanCacheDir());
      self._cacheHash = inputTreeHash;
    }

    linkRecursivelySync(self.getCacheDir(), destDir);
  })
};

CachingWriter.prototype.cleanup = function () {
  quickTemp.remove(this, 'tmpCacheDir')
  Writer.prototype.cleanup.call(this)
}

CachingWriter.prototype.updateCache = function (srcDir, destDir) {
  throw new Error('You must implement updateCache.');
}

module.exports = CachingWriter;

/**********************************************************************
 * Implementation from broccoli-kitchen-sink-helpers v0.1.1.
 * 
 * Note this code was removed due to issues on OSX where hardlinks
 * could cause data loss.  This is only used here to link from the cached copy
 * (which we KNOW was copied and not linked) to the final destination dir.
 *
 * Do NOT use this if you are not 100% certain that the source is NOT a link itself.
 *
 * YOU HAVE BEEN WARNED
**********************************************************************/

// If src is a file, dest is a file name. If src is a directory, dest is the
// directory that the contents of src will be copied into.
//
// This will overwrite dest if necessary. (This does not work when src is a
// file and dest is a directory.)
//
// This does not resolve symlinks. It is not clear whether it should.
//
// Note that unlike cp(1), we do not special-case if dest is an existing
// directory, because relying on things to exist when we're in the middle of
// assembling a new tree is too brittle.
function linkRecursivelySync (src, dest, _mkdirp) {
  if (_mkdirp == null) _mkdirp = true
  // Note: We could try readdir'ing and catching ENOTDIR exceptions, but that
  // is 3x slower than stat'ing in the common case that we have a file.
  var srcStats = fs.lstatSync(src)
  if (srcStats.isDirectory()) {
    mkdirp.sync(dest)
    var entries = fs.readdirSync(src)
    for (var i = 0; i < entries.length; i++) {
      // Set _mkdirp to false when recursing to avoid extra mkdirp calls.
      linkRecursivelySync(src + '/' + entries[i], dest + '/' + entries[i], false)
    }
  } else {
    if (_mkdirp) {
      mkdirp.sync(path.dirname(dest))
    }
    linkAndOverwrite(src, dest)
  }
}


function linkAndOverwrite (srcFile, destFile) {
  try {
    fs.linkSync(srcFile, destFile)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
    fs.unlinkSync(destFile)
    fs.linkSync(srcFile, destFile)
  }
}
// END
