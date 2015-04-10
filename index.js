/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-nf-graph',
  
  included: function(app) {
    this._super.included(app);

    app.import('vendor/ember-cli-nf-graph/ember-cli-nf-graph.css');
    app.import(app.bowerDirectory + '/d3/d3.js');
    app.import(app.bowerDirectory + '/rxjs/dist/rx.all.js'); //probably ham fisted.
    app.import(app.bowerDirectory + '/rx-ember/dist/rx-ember.js');
  }
};
