import Ember from 'ember';

export default Ember.ArrayController.extend({
	actions: {
		rowClick: function(row, group){
			var table = this.get('table');
			if(table) {
				table.sendAction('rowAction', row, group, table);
			}
		},

		groupRowClick: function(group){
			var table = this.get('table');
			if(table) {
				table.sendAction('groupRowAction', group, table);
			}
		},
	}
});