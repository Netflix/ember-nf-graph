import Ember from 'ember';

export default Ember.Component.extend({
	isDataTable: true,
	tagName: 'table',
	
	_columns: null,

	rows: null,

	columns: function(name, value) {
		if(arguments.length > 1) {
			this._columns = value;
		}
		return this._columns;
	}.property(),

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

	parentController: Ember.computed.alias('templateData.view.controller')
});