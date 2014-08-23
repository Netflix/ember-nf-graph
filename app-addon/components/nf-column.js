import Ember from 'ember';

/**
	A column class to support `nf-table`
	@namespace components
	@class nf-column
	@extends Ember.Component
*/
export default Ember.Component.extend({

	/**
		used so child components `nf-cell` and `nf-header` can find this component
		and register themselves.
		@property isDataTableColumn
		@type Boolean
		@default true
		@readonly
	*/
	isDataTableColumn: true,

	/**
		Gets or sets the sort direction for the column.

		Possible Values:

		- `'asc'` - sort ascending.
		- `'desc'` - sort descending.
		- `'none'` - (or any other value) no sort.
		
		@property sortDirection
		@type String
		@default 'none'
		@example

		     {{#nf-column sortDirection="asc"}}
	*/
	sortDirection: 'none',

	/**
		Gets or sets whether to use a natural sort.
		@property sortNatural
		@type Boolean
		@default false
	*/
	sortNatural: false,

	/**
		The numeric value of `sortDirection`
		@property direction
		@type number
		@readonly
	*/
	direction: function(){
		var sortDirection = this.get('sortDirection');
		sortDirection = 'string' === typeof sortDirection ? sortDirection.toLowerCase() : '';
		
		if(sortDirection === 'asc') {
			return 1;
		}
		
		if(sortDirection === 'desc') {
			return -1;
		}

		return 0;
	}.property('sortDirection'),

	/**
		Gets the CSS sort class to be applied to the column

		Possible return values are `nf-sort-ascending`, `nf-sort-descending` and `nf-sort-none`.

		@property sortClass
		@type String
		@default 'nf-sort-none'
		@example

		    column.set('sortDirection', 'asc');
		    console.log(column.get('sortClass')); // nf-sort-ascending
	*/
	sortClass: function() {
		var dir = this.get('direction');
		return 'nf-sort-' + (['descending', 'none', 'ascending'][dir+1]);
	}.property('sortDirection'),

	_register: function(){
		var registrar = this.nearestWithProperty('isTableColumnRegistrar');
		this.set('columnRegistrar', registrar);
		registrar.registerColumn(this);
	}.on('init'),

	_unregister: function(){
		this.get('columnRegistrar').unregisterColumn(this);
	}.on('willDestroyElement')
});