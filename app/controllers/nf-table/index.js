import Ember from 'ember';

export default Ember.ObjectController.extend({
	actions: {
		fooCellClicked: function(row, column, group) {
			console.log('foo clicked', row, column, group);
		},

		rowClicked: function(row, group, table){
			console.log('rowClicked fired!', row, group, table);
		},

		groupClicked: function(group, table){
			console.log('group clicked!', group, table);
		},
	},
});