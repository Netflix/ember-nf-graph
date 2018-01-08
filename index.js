'use strict';

module.exports = {
  name: 'ember-nf-graph',

  options: {
    nodeAssets: {
      d3: {
        vendor: ['d3.js']
      },
      rx: {
        vendor: ['dist/rx.all.js']
      }
    }
  },

  included: function(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    app.import('vendor/d3/d3.js');
    app.import('vendor/rx/dist/rx.all.js');
  }
};
