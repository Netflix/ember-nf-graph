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
		The column's header component
		@property header
		@type nf-header
		@default null
	*/
	header: null,

	/**
		The column's cell component
		@property cell
		@type nf-cell
		@default null
	*/
	cell: null,

	/**
		The table component the column belongs to
		@property table
		@type nf-table
		@default null
	*/
	table: null,

	/**
		Gets or sets the inline style width of both the header and the table cell.
		@property width
		@type String
		@default null
	*/
	width: undefined,

	classNameBindings: [':nf-table-column', 'alignmentClass'],

	/**
		Sets the alignment of the items in the column. Using this attribute
		adds appropriate styling for sort arrows.

		To make sort arrows appear for center and left alignment, the text you want
		the sort arrow to appear next to needs to be wrapped in `<span class="nf-column-label"></span>`

		**This property is completely optional, and is here as a convenience.** 
		You don't need to use this property at all, if you which to add your own sort
		styling.

		@property align
		@type String
		@default null
	*/
	align: null,

	/**
		The computed alignment class for aligning the column content and header
		@property alignmentClass
		@type String
		@readonly
	*/
	alignmentClass: function(){
		var align = this.get('align');
		return align ? 'nf-table-column-' + align : '';
	}.property('align'),

	/**
		The list of classes to apply to table headers
		@property headerClassNames
		@type Array
		@readonly
	*/
	headerClassNames: function() {
		var classNames = this.get('classNames');
		var headerClassNames = this.get('header.classNames') || [];
		return classNames.concat(headerClassNames).join(' ');
	}.property('header.classNames', 'classNames'),

	/**
		The list of classes to apply to table cells
		@property cellClassNames
		@type Array
		@readonly
	*/
	cellClassNames: function(){
		var classNames = this.get('classNames');
		var cellClassNames = this.get('cell.classNames') || [];
		return classNames.concat(cellClassNames).join(' ');
	}.property('cell.classNames', 'classNames'),

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
	sortDirection: function(key, value) {
		if(arguments.length > 1) {
			var colReg = this.get('columnRegistrar');
			if(colReg && !colReg.get('sortMultiple')) {
				if(value === 'asc' || value === 'desc') {
					var sortedColumns = colReg.get('sortedColumns');
					if(sortedColumns) {
						sortedColumns.forEach(function(col) {
							if(col !== this) {
								col.set('sortDirection', 'none');
							}
						}, this);
					}
				}
			}

			this._sortDirection = value;
		}

		return this._sortDirection;
	}.property(),

	_sortDirection: 'none',

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
		List of available sort directions
		@property SORTS
		@constant
		@type Array
	*/
	SORTS: ['desc', 'none', 'asc'],

	/**
		Convenience method for toggling through sort directions on the column. (asc, desc, none) repeat.
		@method toggleSortDirection
	*/
	toggleSortDirection: function() {
		var SORTS = this.get('SORTS');
		var sortDirection = this.get('sortDirection');
		var i = SORTS.indexOf(sortDirection);
		var next = SORTS[(i + 1) % SORTS.length];
		this.set('sortDirection', next);
	},

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

		var table = this.nearestWithProperty('isTable');
		this.set('table', table);
	}.on('init'),

	_unregister: function(){
		this.get('columnRegistrar').unregisterColumn(this);
	}.on('willDestroyElement')
});