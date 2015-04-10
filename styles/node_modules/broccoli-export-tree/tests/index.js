'use strict';

var path = require('path');
var exportTree = require('../index');
var expect = require('expect.js');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var root = process.cwd();

var fs = require('fs');
var broccoli = require('broccoli');

var builder;

describe('broccoli-file-mover', function(){
  var exportLocation = 'tmp/exported/';

  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }

    rimraf.sync(exportLocation);
  });

  it('exports a tree to an external directory', function(){
    var sourcePath = 'tests/fixtures/sample-ember-style-package';
    var tree = exportTree(sourcePath, {
      destDir: exportLocation
    });

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var filePath = '/lib/main.js';
      var expected = fs.readFileSync(sourcePath + filePath);
      var actual   = fs.readFileSync(exportLocation + filePath);

      expect(actual).to.eql(expected);
    });
  });

  it('does not clobber the directory', function(){
    var sourcePath = 'tests/fixtures/sample-ember-style-package';
    var priorFilePath = path.join(root, exportLocation, 'random-stuff.txt');
    var contents   = 'random stuff';

    var tree = exportTree(sourcePath, {
      destDir: exportLocation,
      clobber: false
    });

    mkdirp.sync(exportLocation);
    fs.writeFileSync(priorFilePath, contents, {encoding: 'utf8'});

    builder = new broccoli.Builder(tree);
    return builder.build().then(function(dir) {
      var filePath = '/lib/main.js';
      var expected = fs.readFileSync(sourcePath + filePath);
      var actual   = fs.readFileSync(exportLocation + filePath);

      expect(actual).to.eql(expected);
      expect(fs.readFileSync(priorFilePath, {encoding: 'utf8'})).to.eql(contents);
    });
  })
});
