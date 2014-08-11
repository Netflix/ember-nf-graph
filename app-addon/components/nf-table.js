import Ember from 'ember';
import multiSort from '../utils/multi-sort';
import { SORT_NONE, SORTTYPE_SINGLE, SORTTYPE_MULTI } from '../utils/constants';

/**
	Composable table component with built-in sorting
	
	### Example

	      {{#nf-table rows=myData}}
	      	{{#nf-column sortField="foo"}}
	      	  {{nf-header}}
	      	  	Foo
	      	  {{/nf-header}}
	      	  {{#nf-cell}}
	      			{{row.foo}}
	      	  {{/nf-cell}}
	      	{{/nf-column}}
	      	{{#nf-column sortField="foo"}}
	      	  {{nf-header}}
	      	  	Bar
	      	  {{/nf-header}}
	      	  {{#nf-cell}}
	      			{{row.bar}}
	      	  {{/nf-cell}}
	      	{{/nf-column}}
	      {{/nf-table}}
	
	The example above will create a sortable table from an array `myData` containing objects
	with fields `foo` and `bar`.

	### Styling
	
	nf-table emits a `<table>` with a class of `nf-table` applied to it.


	@namespace components
	@class nf-table
	@extends Ember.Component
*/
export default Ember.Component.extend({
	/**
		Used to allow child components to identify this component as an nf-table component.
		@property isDataTable 
		@type Boolean
		@readonly
	*/
	isDataTable: true,

	tagName: 'table',

	/**
		The data source for rows to display in this table.
		@property rows
		@default null
	*/
	rows: null,

	classNames: ['nf-table'],

	/**
		The type of sorting to do on the table. `'multi'` or `'single'`.
		@property sortType
		@type String
		@default 'single'
	*/
	sortType: SORTTYPE_SINGLE,

	/**
		the registered columns
		@property columns
		@type Array
		@readonly
	*/
	columns: function() {
		return [];
	}.property(),

	/**
		Registers a child column with the table.
		@method registerColumn
		@param column {Ember.Component} the column to register with the table.
	*/
	registerColumn: function(column) {
		this.get('columns').pushObject(column);
	},

	/**
		Unregisters a child column from the table.
		@method unregisterColumn
		@param column {Ember.Component} the column to unregister from the table.
	*/
	unregisterColumn: function(column) {
		this.get('columns').removeObject(column);
	},

	_hasRendered: function() {
		this.set('hasRendered', true);
	}.on('didInsertElement'),

	/**
		A computed property returning a sorted copy of `rows`
		@property sortedRows
		@type Array
		@readonly
	*/
	sortedRows: function(){
		var sort = this.get('columns').filter(function(col) {
			return col.get('sortDirection') && col.get('sortBy');
		}).map(function(col) {
			return {
				by: col.get('sortBy').replace(/^row\./, ''),
				direction: col.get('sortDirection')
			};
		});

		var rowsCopy = this.get('rows').slice();
		multiSort(rowsCopy, sort);
		return rowsCopy;
	}.property('rows.@each', 'columns.@each.sortDirection', 'columns.@each.sortBy'),

	/**
		A computed alias returning the controller of the current view. Used to wire
		up child templates to the proper controller.
		@property parentController
		@type Ember.Controller
		@readonly
	*/
	parentController: Ember.computed.alias('templateData.view.controller'),

	actions: {

		/**
			Action handler to sort columns by a passed column. Sets the `sortDirection`
			of the pass column to the appropriate value based on the `sortType`.
			@method actions.sort
			@param sortedColumn {nf-column}
		*/
		sort: function(sortedColumn) {
			var columns = this.get('columns');
			var sortType = this.get('sortType');
			var currentSortDir = sortedColumn.get('sortDirection');

			if(sortType === SORTTYPE_SINGLE) {
				columns.forEach(function(col) {
					col.set('sortDirection', SORT_NONE);
				});
				sortedColumn.set('sortDirection', [1, 1, -1][currentSortDir + 1]);
			}

			if(sortType === SORTTYPE_MULTI) {
				sortedColumn.set('sortDirection', [0, 1, -1][currentSortDir + 1]);
			}
		}
	}
});