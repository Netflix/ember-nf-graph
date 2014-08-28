import Ember from 'ember';
import multiSort from '../utils/multi-sort';
import TableColumnRegistrar from '../mixins/table-column-registrar';
import parsePropExpr from '../utils/parse-property-expression';
import { naturalCompare } from '../utils/nf/array-helpers'; 

/**
	Composable table component with built-in sorting
	
	### Basic Example

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

	### Grouped Example

	If you wish to create a "grouped table", you simply need to group the data with the `groupBy`
	property.

	Additionally, you can add grouping rows with the `{{nf-table-group}}` component, which allows you
	to define the columns for the group rows. If you do this, you will need to create an ArrayController
	for the group that will carry with it any computed properties you might need, such as a sum or average
	aggregated over the group.

				{{#nf-table rows=myData groupBy="baz"}}
					
					{{#nf-table-group itemController="my-group-controller"}}
						
						{{#nf-column}}
							{{#nf-cell colspan="2"}}
								Baz = {{group.groupValue}}
							{{/nf-cell}}
						{{/nf-column}}

					{{/nf-table-group}}

	      	{{#nf-column sortBy="foo"}}
	      	  {{nf-header}}
	      	  	Foo
	      	  {{/nf-header}}
	      	  {{#nf-cell}}
	      			{{row.foo}}
	      	  {{/nf-cell}}
	      	{{/nf-column}}
	      	
	      	{{#nf-column sortBy="foo"}}
	      	  {{nf-header}}
	      	  	Bar
	      	  {{/nf-header}}
	      	  {{#nf-cell}}
	      			{{row.bar}}
	      	  {{/nf-cell}}
	      	{{/nf-column}}

	      {{/nf-table}}

	### Styling
	
	nf-table emits a `<table>` with a class of `nf-table` applied to it.


	@namespace components
	@class nf-table
	@extends Ember.Component
	@uses mixins.table-column-registrar
*/
export default Ember.Component.extend(TableColumnRegistrar, {
	tagName: 'div',

	/**
		Property used by child components to locate the table component.
		@property isTable
		@type Boolean
		@default true
	*/
	isTable: true,

	/**
		Gets the nf-table-group component if one is present.
		@property tableGroup
		@type components.nf-table-group
		@default null
	*/
	tableGroup: null,

	/**
		The expression used to locate the values in the rows to group by.
		@property groupBy
		@type String
		@default null
	*/
	groupBy: null,

	/**
		Gets or sets whether the table has a scrollable layout.
		@property scrollable
		@type Boolean
		@default false
	*/
	scrollable: false,

	/**
		Gets whether or not to use the grouped table layout
		@property useGroupedTableLayout
		@type Boolean
		@private
		@readonly
	*/
	useGroupedTableLayout: Ember.computed.bool('groupBy'),

	/**
		Gets an array of grouped and sorted data, represented as an array of arrays.
		@property sortedGroups
		@type Array
		@readonly
	*/
	sortedGroups: function() {
		var sortMap = this.get('sortMap');
		var rows = this.get('rows');
		var groupBy = this.get('groupBy');
		if(!groupBy || !rows || rows.length === 0) {
			return null;
		}

		var alreadyGrouping = sortMap.any(function(x) {
			return x.by === groupBy;
		});

		if(!alreadyGrouping) {
			sortMap.unshift({
				by: groupBy,
				direction: 1
			});
		}

		var rowsCopy = rows.slice();
		multiSort(rowsCopy, sortMap);

		var prevGroupVal;
		var group;
		var groupByExpr = parsePropExpr(groupBy);

		var groups = rowsCopy.reduce(function(groups, d) {
			var groupVal = groupByExpr(d) || null;

			if(groupVal !== prevGroupVal) {
				group = [];
				group.groupValue = groupVal;
				groups.push(group);
				prevGroupVal = groupVal;
			}

			group.push(d);
			return groups;
		}, []);

		var tableGroupingCtrl = Ember.ArrayController.create({
			container: this.get('container'),
			content: groups,
		});

		var itemController = this.get('tableGroup.itemController');

		if(itemController) {
			tableGroupingCtrl.set('itemController', itemController);
		}

		return tableGroupingCtrl;
	}.property('rows.@each', 'sortMap', 'groupBy', 'tableGroup.itemController'),


	/**
		The data source for rows to display in this table.
		@property rows
		@default null
	*/
	rows: null,

	classNames: ['nf-table'],

	hasRendered: false,

	/**
		Gets or sets whether a multi sort is used.
		@property sortMultiple
		@type Boolean
		@default false
	*/
	sortMultiple: false,

	_hasRendered: function() {
		this.set('hasRendered', true);
	}.on('willInsertElement'),

	/**
		Gets the an array of sorts, in order to be processed when sorting the rows.
		@property sortMap
		@readonly
		@private
	*/
	sortMap: function(){
		return this.get('columns').reduce(function(sortMap, col) {
			var direction = col.get('direction');
			if(direction) {
				var sortBy = col.get('sortBy');
				sortBy = sortBy.replace(/^row\./, '');
				if(sortBy) {
					if(col.get('sortNatural')) {
						sortMap.push(function(a, b){
							var ax = Ember.get(a, sortBy);
							var bx = Ember.get(b, sortBy);
							return naturalCompare(ax, bx) * direction;
						});
					} else {
						sortMap.push({
							by: sortBy,
							direction: direction,
						});
					}
				}
			}
			return sortMap;
		}, []);
	}.property('columns.@each.sortDirection', 'columns.@each.sortBy'),

	/**
		A computed property returning a sorted copy of `rows`
		@property sortedRows
		@type Array
		@readonly
	*/
	sortedRows: function(){
		var sortMap = this.get('sortMap');
		var rowsCopy = this.get('rows').slice();
		multiSort(rowsCopy, sortMap);
		return rowsCopy;
	}.property('rows.@each', 'sortMap'),

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
			var sortMultiple = this.get('sortMultiple');
			var currentSortDir = sortedColumn.get('direction');

			if(sortMultiple) {
				sortedColumn.set('sortDirection', ['none', 'asc', 'desc'][currentSortDir + 1]);
			} else {
				columns.forEach(function(col) {
					col.set('sortDirection', 0);
				});
				sortedColumn.set('sortDirection', ['asc', 'asc', 'desc'][currentSortDir + 1]);
			}
		},

		/**
			Handles the cell click action and sends the appropriate action to the view.
			@method actions.cellClicked
			@param row {Object} the data row from the the rows array
			@param column {nf-column} the column component for the current column
			@param group {Array} the array containing the group data (this is undefined if the table is not grouped)
		*/
		cellClicked: function(row, column, group) {
			var cellAction = Ember.get(column, 'cell.action');
			if(cellAction) {
				this.get('parentController').send('cellClickAction', row, column, group);
			}
		},
	},
});

