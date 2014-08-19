import Ember from 'ember';

export default Ember.ObjectController.extend({
	actions: {
		fooCellClicked: function(row, column, group) {
			console.log('foo clicked', row, column, group);
		},
	},
});