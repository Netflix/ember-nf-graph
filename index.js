/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-nf-graph',

  included: function(app) {
    this._super.included(app);

    // app.import('vendor/ember-nf-graph/ember-nf-graph.css');
    app.import(app.bowerDirectory + '/d3/d3.js');
    // app.import('vendor/ember-nf-graph/ember-jquery-svg-class-patch.js');
    app.import(app.bowerDirectory + '/rxjs/dist/rx.all.js');
  }
};
