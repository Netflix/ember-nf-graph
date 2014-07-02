import Ember from 'ember';

export default Ember.Component.extend({
	isDataTable: true,
	tagName: 'table',
	rows: null,

	_columns: null,
	columns: function(name, value) {
		if(arguments.length > 1) {
			this._columns = value;
		}
		return this._columns;
	}.property(),

	_sortBy: null,
	sortBy: function(name, value) {
		if(arguments.length > 1) {
			this._sortBy = value;
		}
		return this._sortBy;
	},

	registerColumn: function(column) {
		var columns = this.get('columns');
		columns.pushObject(column);
	},

	_setup: function() {
		this.set('columns', []);
	}.on('init'),

	didInsertElement: function() {
		this.set('hasRendered', true);
	},

	parentController: Ember.computed.alias('templateData.view.controller'),

	sortedRows: function(){

	}.property('rows', 'sortedColumn'),
	
	actions: {
		sort: function(sortedColumn) {
			var columns = this.get('columns');
			columns.filter(function(column) {
				return column != sortedColumn;
			}).forEach(function(column) {
				column.unsort();
			});
			sortedColumn.sortBy();
		}
	}
});