import Ember from 'ember';

export default Ember.ArrayController.extend({
	name: function(){
		return this.get('model.firstObject.blah') + ' Group';
	}.property('model.firstObject.blah')
});