import Ember from 'ember';

/**
	Marks a component as a registry for table columns
	@namespace mixins
	@class table-column-registrar
*/
export default Ember.Mixin.create({

	/**
		Gets or sets whether a multi sort is used.
		@property sortMultiple
		@type Boolean
		@default false
	*/
	sortMultiple: false,

	/**
		identifies the component as a table column registrar to its children
		@property isTableColumnRegistrar
		@type Boolean
		@default true
	*/
	isTableColumnRegistrar: true,

	/**
		An emitted list of columns
		@property columns
		@type Array
		@readonly
	*/
	columns: null,

	/**
		The collection of columns registered
		@property _columns
		@type Array
		@readonly
		@private
	*/
	_columns: function(key, value) { //jshint ignore:line
		return [];
	}.property(),

	emitColumns: function() {
		this.set('columns', this.get('_columns'));
	}.observes('_columns.[]'),

	/**
		The list of visible columns
		@property visibleColumns
		@type Array
		@readonly
	*/
	visibleColumns: Ember.computed.filter('_columns', function(col){
		return col.get('isVisible');
	}),

	/**
		The list of columns with an sort applied to them
		@property sortedColumns
		@type Array
		@readonly
	*/
	sortedColumns: Ember.computed.filter('_columns', function(col) {
		return col.get('direction') !== 0;
	}),

	/**
		Registers a column with the registrar
		@method registerColumn
		@param column {components.nf-column} the column to register
	*/
	registerColumn: function(column) {
		this.get('_columns').pushObject(column);
	},

	/**
		Unregisters a column from the registry
		@method unregisterColumn
		@param column {components.nf-column} the column to unregister
	*/
	unregisterColumn: function(column) {
		this.get('_columns').removeObject(column);
	},
});