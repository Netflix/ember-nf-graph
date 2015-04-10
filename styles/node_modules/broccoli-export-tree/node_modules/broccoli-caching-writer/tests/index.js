'use strict';

var fs = require('fs');
var path = require('path');
var expect = require('expect.js');
var RSVP = require('rsvp');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var root = process.cwd();
var broccoli = require('broccoli');

var cachingWriter = require('..');

var builder;

describe('broccoli-caching-writer', function(){
  var sourcePath = 'tests/fixtures/sample-project';
  var dummyChangedFile = sourcePath + '/dummy-changed-file';

  afterEach(function() {
    if (builder) {
      builder.cleanup();
    }

    if (fs.existsSync(dummyChangedFile)) {
      fs.unlinkSync(dummyChangedFile);
    }
  });

  describe('write', function() {
    it('calls updateCache when there is no cache', function(){
      var updateCacheCalled = false;
      var tree = cachingWriter(sourcePath, {
        updateCache: function() {
          updateCacheCalled = true;
        }
      });

      builder = new broccoli.Builder(tree);
      return builder.build().finally(function() {
        expect(updateCacheCalled).to.be.ok();
      });
    });

    it('is provided a source and destination directory', function(){
      var updateCacheCalled = false;
      var tree = cachingWriter(sourcePath, {
        updateCache: function(srcDir, destDir) {
          expect(fs.statSync(srcDir).isDirectory()).to.be.ok();
          expect(fs.statSync(destDir).isDirectory()).to.be.ok();
        }
      });

      builder = new broccoli.Builder(tree);
      return builder.build()
    });

    it('only calls updateCache once if input is not changing', function(){
      var updateCacheCount = 0;
      var tree = cachingWriter(sourcePath, {
        updateCache: function() {
          updateCacheCount++;
        }
      });

      builder = new broccoli.Builder(tree);
      return RSVP.all([builder.build(), builder.build(), builder.build()])
        .then(function() {
          expect(updateCacheCount).to.eql(1);
        });
    });

    it('calls updateCache again if input is changed', function(){
      var updateCacheCount = 0;
      var tree = cachingWriter(sourcePath, {
        updateCache: function() {
          updateCacheCount++;
        }
      });

      builder = new broccoli.Builder(tree);

      return builder.build()
        .finally(function() {
          expect(updateCacheCount).to.eql(1);
        })
        .then(function() {
          fs.writeFileSync(dummyChangedFile, 'bergh');

          return RSVP.all([
              builder.build(),
              builder.build(),
              builder.build()
            ])
        })
        .finally(function() {
          expect(updateCacheCount).to.eql(2);
        });
    });
  });

  describe('updateCache', function() {
    it('can write files to destDir, and they will be in the final output', function(){
      var tree = cachingWriter(sourcePath, {
        updateCache: function(srcDir, destDir) {
          fs.writeFileSync(destDir + '/something-cool.js', 'zomg blammo', {encoding: 'utf8'});
        }
      });

      builder = new broccoli.Builder(tree);
      return builder.build().finally(function(dir) {
        expect(fs.readFileSync(dir + '/something-cool.js', {encoding: 'utf8'})).to.eql('zomg blammo');
      });
    });

    it('throws an error if not overriden', function(){
      var tree = cachingWriter(sourcePath);

      builder = new broccoli.Builder(tree);
      return builder.build()
        .catch(function(reason) {
          expect(reason.message).to.eql('You must implement updateCache.');
        });
    });
  });
});
