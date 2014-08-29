import Ember from 'ember';

/**
	Marks a component as a registry for table columns
	@namespace mixins
	@class table-column-registrar
*/
export default Ember.Mixin.create({
	/**
		identifies the component as a table column registrar to its children
		@property isTableColumnRegistrar
		@type Boolean
		@default true
	*/
	isTableColumnRegistrar: true,

	/**
		The collection of columns registered
		@property columns
		@type Array
		@readonly
	*/
	columns: function(key, value) {
		return this.get('_columns');
	}.property('_columns'),

	visibleColumns: function(){
		return this.get('columns').filter(function(column) {
			return column.get('isVisible');
		});
	}.property('columns.@each'),

	/**
		Registers a column with the registrar
		@method registerColumn
		@param column {components.nf-column} the column to register
	*/
	registerColumn: function(column) {
		this.get('columns').pushObject(column);
	},

	/**
		Unregisters a column from the registry
		@method unregisterColumn
		@param column {components.nf-column} the column to unregister
	*/
	unregisterColumn: function(column) {
		this.get('columns').removeObject(column);
	},

	_initializeColumns: function() {
		this.set('_columns', []);
	}.on('init'),
});