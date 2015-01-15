import Ember from 'ember';

export default Ember.ObjectController.extend({
	barPlus: function(){
		return this.get('bar') + '+++';
	}.property('bar'),
});