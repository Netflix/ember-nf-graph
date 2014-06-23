'use strict';

var path = require('path');
var fs   = require('fs');

function EmberCLIEmberDVC(project) {
  this.project = project;
  this.name    = 'Ember CLI Ember DVC';
}

function unwatchedTree(dir) {
  return {
    read:    function() { return dir; },
    cleanup: function() { }
  };
}

EmberCLIEmberDVC.prototype.treeFor = function treeFor(name) {
  var treePath =  path.join('node_modules', 'ember-cli-ember-dvc', name + '-addon');

  if (fs.existsSync(treePath)) {
    return unwatchedTree(treePath);
  }
};

EmberCLIEmberDVC.prototype.included = function included(app) {
  this.app = app;
};

module.exports = EmberCLIEmberDVC;