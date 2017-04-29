import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('nf-graph', function(){
    this.route('/');
    this.route('nf-bars');
  });

  this.route('examples');
});

export default Router;
