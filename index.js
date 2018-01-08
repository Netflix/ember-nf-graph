'use strict';

module.exports = {
  name: 'ember-nf-graph',

  included: function(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    app.import(app.bowerDirectory + '/d3/d3.js');
    app.import(app.bowerDirectory + '/rxjs/dist/rx.all.js');
  }
};
