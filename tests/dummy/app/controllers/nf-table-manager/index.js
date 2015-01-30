import Ember from 'ember';

export default Ember.ObjectController.extend({
	actions: {
		childrenOfTheScroll: function(context){
			console.log('children mutated!!!', context);
		}
	}
})