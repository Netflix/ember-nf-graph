import Ember from 'ember';

var Router = Ember.Router.extend({
  location: EmberCliEmberDvcENV.locationType
});

Router.map(function() {
	this.resource('graph', function(){
		this.route('/');
	});

	this.resource('nf-table', function(){
		this.route('/');
	});
});

export default Router;
