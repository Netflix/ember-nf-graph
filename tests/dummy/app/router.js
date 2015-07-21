import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.resource('nf-graph', function(){
    this.route('/');
    this.route('nf-bars');
  });

  this.route('examples');
});

export default Router;
