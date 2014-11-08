import Ember from 'ember';
import multiSort from '../utils/multi-sort';
import TableColumnRegistrar from '../mixins/table-column-registrar';
import parsePropExpr from '../utils/parse-property-expression';
import NfTableGroupController from '../controllers/nf-table-group-controller';
import trackedArrayProperty from '../utils/nf/tracked-array-property';

/**
	Composable table component with built-in sorting
	
	### Basic Example

	      {{#nf-table rows=myData}}

	      	{{#nf-column sortField="foo"}}
	      	  {{nf-header}}
	      	  	<span class="nf-column-label">Foo</span>
	      	  {{/nf-header}}
	      	  {{#nf-cell}}
	      			{{row.foo}}
	      	  {{/nf-cell}}
	      	{{/nf-column}}

	      	{{#nf-column sortField="foo"}}
	      	  {{nf-header}}
	      	  	<span class="nf-column-label">Bar</span>
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
	to define the columns for the group rows. **If you do this, you will need to create an ArrayController**
	for the group that will carry with it any computed properties you might need, such as a sum or average
	aggregated over the group. The array controller for your grouping must be assigned to the `itemController`
	property on the `nf-table-group` component.

				{{#nf-table rows=myData groupBy="baz"}}
					
					{{#nf-table-group itemController="my-group-row"}}

						{{#nf-column}}
							{{#nf-cell colspan="2"}}
								Baz: {{group.baz}}
								Bars: {{group.barSum}}
							{{/nf-cell}}
						{{/nf-column}}
					
					{{/nf-table-group}}

	      	{{#nf-column sortBy="foo"}}
	      	  {{nf-header}}
	      	  	<span class="nf-column-label">Foo</span>
	      	  {{/nf-header}}
	      	  {{#nf-cell}}
	      			{{row.foo}}
	      	  {{/nf-cell}}
	      	{{/nf-column}}
	      	
	      	{{#nf-column sortBy="foo"}}
	      	  {{nf-header}}
	      	  	<span class="nf-column-label">Bar</span>
	      	  {{/nf-header}}
	      	  {{#nf-cell}}
	      			{{row.bar}}
	      	  {{/nf-cell}}
	      	{{/nf-column}}

	      {{/nf-table}}

	Which would need an accompanying array controller definition `my-group-row`:

				export default Ember.ArrayController.extend({
					// returns the first value from the array
					baz: function(){
						return this.get('model')[0].baz;
					}.property('model.@each.baz'),

					//gets the sum of all the bars
					barSum: function() {
						return this.get('model').reduce(function(sum, item) {
							return sum + item.bar;
						}, 0);
					}.property('model.@each.bar'),
			  });

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
		The type of grouping to perform with the groupBy

		# options
		- `'flat'`: (default) rows data is flattened and groups are aggregated by matching
								the property specified with `groupBy`. For example, if `groupBy="foo"` rows
								will be grouped by all rows with a `foo` property that matches.
		- `'hierarchy'`: rows data is already in parent/child format. Parent rows contain child rows on 
								the property specified with `groupBy`. For example, if `groupBy="children"`, each row
								in the base rows data array will be a grouping row, and the	array of items under 
								`children` will be used as the "child" rows of each group.
		@property groupFrom
		@type String
		@default 'flat'
	*/
	groupFrom: 'flat',

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

	getGroupsFromFlattened: function(rows, groupBy, sortMap){
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

		return rowsCopy.reduce(function(groups, d) {
			var groupVal = groupByExpr(d) || null;

			if(groupVal !== prevGroupVal) {
				group = {
					_groupChildren: [],
					_groupValue: groupVal,
				};
				groups.push(group);
				prevGroupVal = groupVal;
			}

			group._groupChildren.push(d);
			return groups;
		}, []);
	},

	getGroupsFromHierarchy: function(rows, groupBy, sortMap) {
		var rowsCopy = rows.slice();
		var groupSortMap = this.get('tableGroup.sortMap');
		multiSort(rowsCopy, groupSortMap);
		rowsCopy.forEach(function(row) {
			var childRows = (Ember.get(row, groupBy) || []).slice();
			multiSort(childRows, sortMap);
			Ember.set(row, '_groupChildren', childRows);
		});
		return rowsCopy;
	},

	/**
		Gets an array of grouped and sorted data, represented as an array of arrays.
		@property sortedGroups
		@type Array
		@readonly
	*/
	sortedGroups: function() {
		var sortMap 	= this.get('sortMap');
		var rows 			= this.get('rows');
		var groupBy 	= this.get('groupBy');
		var groupFrom = this.get('groupFrom');

		if(!groupBy || !rows || rows.length === 0) {
			return null;
		}

		var groups = groupFrom === 'hierarchy' ? 
			this.getGroupsFromHierarchy(rows, groupBy, sortMap) :
			this.getGroupsFromFlattened(rows, groupBy, sortMap);

		if(this.get('sortedAction')) {
			this.sendAction('sortedAction', groups);
		}
		
		var tableGroupingCtrl = NfTableGroupController.create({
			container: this.get('container'),
			content: groups,
			table: this,
		});

		var itemController = this.get('tableGroup.itemController');

		if(itemController) {
			tableGroupingCtrl.set('itemController', itemController);
		}

		return tableGroupingCtrl;
	}.property('rows.[]', 'sortMap', 'groupBy', 'groupFrom', 'tableGroup.itemController'),

	/**
		Alias for the rowAction on the nf-table-group
		@property groupRowAction
		@type String
		@default null
	*/
	groupRowAction: Ember.computed.alias('tableGroup.rowAction'),

	/**
		The data source for rows to display in this table.
		@property rows
		@default null
	*/
	rows: null,

	classNames: ['nf-table'],

	hasRendered: false,

	_hasRendered: function() {
		this.set('hasRendered', true);
	}.on('willInsertElement'),

	/**
		The property on each row item to track data by. If undefined, will track by index.
		@property trackBy
		@type String
		@default undefined
	*/
	trackBy: undefined,

	/**
		The rows to render, tracked by whatever field is listed in teh trackBy property
		@property trackedRows
		@type Array
		@readonly
		@private
	*/
	trackedRows: trackedArrayProperty('rows', 'trackBy'),

	/**
		Triggers the `willSort` and `didSort` events. Also calls `doSort`
		@method onSort
	*/
	onSort: function(){
		this.trigger('willSort');
		this.doSort();
		this.trigger('didSort');
	},

	/**
		Performs the sort by reorganizing the DOM. If you want to use some other 
		method of sorting, this is the guy you'll need to override.
		@method doSort
	*/
	doSort: function(){
		var sortableElems = this.$('[data-nf-table-sort-key]');
		if(Ember.isArray(sortableElems) && sortableElems.length > 1) {
			var sortedRows = this.get('sortedRows');
			var trackBy = this.get('trackBy');
			if(sortedRows) {
				sortedRows.forEach(function(row) {
					var key = trackBy ? Ember.get(row, trackBy) : row.__meta__originalIndex;
					var elem = sortableElems.filter('[data-nf-table-sort-key="' + key + '"]');
					elem.parent().append(elem);
				});
			}
		}
	},

	/**
		Observes changes to column sorts and fires the `onSort` method afterRender
		@method observeSortChanges
	*/
	observeSortChanges: function(){
		Ember.run.scheduleOnce('afterRender', this, this.onSort);
	}.observes('_columns.@each.sortDirection', '_columns.@each.sortBy'),

	/**
		A computed property returning a sorted copy of `rows`
		@property sortedRows
		@type Array
		@readonly
	*/
	sortedRows: function(){
		var sortMap = this.get('sortMap');
		var rowsCopy = this.get('rows').slice();
		var trackBy = this.get('trackBy');
		if(!trackBy) {
			rowsCopy.forEach(function(d, i) {
				d.__meta__originalIndex = i;
			});
		}
		multiSort(rowsCopy, sortMap);
		if(this.get('sortedAction')) {
			this.sendAction('sortedAction', rowsCopy);
		}
		return rowsCopy;
	}.property('rows.[]', 'sortMap'),

	emitSortedInner: function(){
		if(this.get('groupBy')) {
			return this.get('sortedGroups');
		} else {
			return this.get('sortedRows');
		}
	}.property('sortedRows.[]', 'sortedGroups.[]', 'groupBy'),

	emitSorted: Ember.computed.oneWay('emitSortedInner'),

	/**
		A computed alias returning the controller of the current view. Used to wire
		up child templates to the proper controller.
		@property parentController
		@type Ember.Controller
		@readonly
	*/
	parentController: Ember.computed.alias('templateData.view.controller'),

	/**
		The name of the action to fire when a row is clicked.
		Sends an object with the `row` and `table`.

		For group rows, see {{#crossLink "components.nf-table-group/rowAction:property"}}{{/crossLink}}.
		@property rowAction
		@type String
		@default null
	*/
	rowAction: null,

	/**
		An action to be fired when the rows are sorted.
		Passes the sorted rows (or groups)
		@property sortedAction
		@type String
		@default null
	*/
	sortedAction: null,

	actions: {

		/**
			Action handler to sort columns by a passed column. Sets the `sortDirection`
			of the pass column to the appropriate value based on the `sortType`.
			@method actions.sort
			@param sortedColumn {nf-column}
		*/
		sort: function(sortedColumn) {
			sortedColumn.toggleSortDirection();
		},

		rowClick: function(row, group){
			this.sendAction('rowAction', row, group, this);
		},

		groupRowClick: function(group){
			this.sendAction('groupRowAction', group, this);
		},

		scrolled: function(e) {
			e.data = this;
			this.sendAction('scrollAction', e);
		},
	},
});

