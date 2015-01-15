import Ember from 'ember';

export default Ember.ObjectController.extend({
	scrollTo: 0,

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

		toggleSort: function(column) {
			var sortDir = column.get('sortDirection');
			var sorts = ['desc', 'none', 'asc'];

			var i = sorts.indexOf(sortDir);
			var j = (i + 1) % sorts.length;
			column.set('sortDirection', sorts[j]);
		},

		tableScrolled: function(e) {
			this.set('tableScroll', e);
		},

		scrollyScrolly: function(){
			this.set('scrollTo', this.get('scrollTo') + 0.2);
		}
	},
});