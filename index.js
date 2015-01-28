/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-ember-dvc',

  included: function(app) {
  	this._super.included(app);

  	app.import('vendor/ember-cli-ember-dvc/ember-cli-ember-dvc.css');
  }
};
