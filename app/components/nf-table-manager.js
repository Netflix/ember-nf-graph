import Ember from 'ember';
import multiSort from 'ember-cli-ember-dvc/utils/multi-sort';
import trackedArrayProperty from 'ember-cli-ember-dvc/utils/nf/tracked-array-property';
import { naturalCompare } from 'ember-cli-ember-dvc/utils/nf/array-helpers';

var get = Ember.get;
var set = Ember.set;

/**
	Composable table component with built-in sorting
	
	### Basic Example

				{{#nf-table-manager rows=myData groupBy="baz" dataChange="actionName"}}
	      	{{#nf-column sortBy="foo"}}
	      	  <span class="nf-column-label">Foo</span>
	      	{{/nf-column}}
	      	
	      	{{#nf-column sortBy="foo"}}
	      	  <span class="nf-column-label">Bar</span>
	      	{{/nf-column}}
	      {{/nf-table-manager}}

	### Styling
	
	nf-table renders a structure of `div.nf-table-manager > table > thead > tr > th.nf-header.nf-table-column`


	@namespace components
	@class nf-table-manager
	@extends Ember.Component
	@deprecated
*/
export default Ember.Component.extend({
	tagName: 'div',

	/**
		Gets or sets the scroll of the underlying 
		scroll area if there is one.
		@property scrollTop
		@type {Number}
		@default 0
	*/
	scrollTop: 0,

	/**
		Gets or sets the scroll by percentage
		of scrollHeight of the underlying 
		scroll area if there is one.
		@property scrollTopPercentage
		@type {Number}
		@default 0
	*/
	scrollTopPercentage: 0,

	/**
		Property used by child components to locate the table component.
		@property isTableManager
		@type {Boolean}
		@default true
	*/
	isTableManager: true,

	/**
		The expression used to locate the values in the rows to group by.
		@property groupBy
		@type {String}
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
		@type {Boolean}
		@default false
	*/
	scrollable: false,

	/**
		The name of an item controller for the rows
		@property itemController
		@type {String}
		@default null
	*/
	itemController: null,

	/**
		Gets whether or not to use the grouped table layout
		@property useGroupedTableLayout
		@type {Boolean}
		@private
		@readonly
	*/
	useGroupedTableLayout: Ember.computed.bool('groupBy'),

	/**
		The optional name of an item controller to use on each grouping
		@property groupItemController
		@type {String}
		@default null
	*/
	groupItemController: null,

	_getArrayController: function(content, ctrlName, itemControllerProp) {
		var CtrlClass = this.container.lookupFactory('controller:' + ctrlName);
		var ctrl = CtrlClass.create({
			content: content,
			table: this
		});
		var itemController = itemControllerProp && this.get(itemControllerProp);
		if(itemController) {
			ctrl.set('itemController', itemController);
		}
		return ctrl;
	},


	/**
		Alias for the rowAction on the nf-table-group
		@property groupRowAction
		@type {String}
		@default null
	*/
	groupRowAction: Ember.computed.alias('tableGroup.rowAction'),

	/**
		The data source for rows to display in this table.
		@property rows
		@default null
	*/
	rows: null,

	getGroups: function() {
		var rows = this.get('rows');
		var itemController = this.get('itemController');
		var groupBy = this.get('groupBy');
		var groupFrom = this.get('groupFrom');
		var trackBy = this.get('trackBy');
		var sortFn = this.get('sortFn');

		Ember.run(this, function(){
			if(!this._groups) {
				var groupItemController = this.get('groupItemController');
				this._groups = this._getArrayController([], 'nf-table-group-controller', groupItemController);
				this._groups.set('sortProperties', ['groupKey']);
			}

			var sortChanged = this._groups.get('sortFn') !== this.get('sortFn');
			if(sortChanged) {
				this._groups.get('content').clear();
				this._groups.set('sortFn', this.get('sortFn'));
			}

			if(Ember.isArray(rows)) {
				var trackedKeys = new Map();
				var groupKeys = new Map();
				var groupsContent = this._groups.get('content');

				// if the rows data provided is hierarchical, flatten it.
				if(groupFrom === 'hierarchy') {
					var flattened = rows.reduce([], (flat, outer, g) => {
						var inner = get(outer, groupBy);
						if(Ember.isArray(inner)) {
							inner.forEach(row => {
								set(row, '__groupKey', g)
								flat.pushObject(row);
							})
						}
						return flat;
					})

					rows = flattened;
					groupBy = '__groupKey';
				}

				var getTrackingKey = (row, index) => {
					return trackBy ? get(row, trackBy) : index;
				};

				// group and reconcile rows and groups
				rows.forEach((row, ri) => {
					var groupKey = groupBy ? get(row, groupBy) : 'ungrouped';
					var trackingKey = getTrackingKey(row, ri);
					trackedKeys[trackingKey] = true;
					groupKeys[groupKey] = true;

					// if there's already a rows controller, add to it.
					var rowsController = groupsContent.find(rc => rc.get('groupKey') === groupKey);
					if(!rowsController) {
						rowsController = this._getArrayController([], 'nf-table-rows-controller', itemController);
						rowsController.set('groupKey', groupKey);
						rowsController.set('customSort', sortFn);
						groupsContent.pushObject(rowsController);
					}

					var rowsContent = rowsController.get('content');

					var foundRow = rowsContent.find((r, i) => trackingKey === getTrackingKey(r, i));
					if(foundRow) {
						// if there's already a row with a matching tracking key (found with trackBy) update it.
						Ember.keys(row).forEach(key => {
							var val = get(row, key);
							if(get(foundRow, key) !== val) {
								set(foundRow, key, val);
							}
						});
					} else {
						// otherwise add this one.
						rowsContent.pushObject(row);
					}
				}, this);

				// remove groups and rows that were not provided
				groupsContent.forEach(rowsController => {
					// if nothing was grouped by a particular group key, 
					// remove it's rowsController
					if(!groupKeys[rowsController.get('groupKey')]) {
						groupsContent.remove(rowsController);
						rowsController.destroy();
					} else {
						var rowsContent = rowsController.get('content');
						rowsContent.forEach((r, i) => {
							// if nothing was tracked by a row's tracking key
							// remove the row from the row controller
							if(!trackedKeys[getTrackingKey(r, i)]) {
								rowsContent.removeObject(r);
							}
						}, this);
					}
				}, this);
			}
		});
		return this._groups;
	},

	emitDataChange: function(){
		var groups = this.getGroups();
		this.set('groups', groups);
		this.sendAction('groupsUpdated', groups);
	},

	_dataChanged: function(){
		Ember.run.once(this, this.emitDataChange);
	}.observes('rows.[]', '_columns.@each.sortDirection', '_columns.@each.sortBy', 'groupBy', 'trackBy', 'groupFrom', 'itemController', 'groupItemController'),

	emitColumnChange: function(){
		var columns = this.get('_columns');
		this.set('columns', columns);
		this.sendAction('columnsUpdated', columns);
	},

	_columnsChanged: function(){
		Ember.run.once(this, this.emitColumnChange);
	}.observes('_columns.[]'),

	classNames: ['nf-table-manager'],

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
		The columns for the table, actually emited to the view context.
		@property columns
		@type {Array} an array of nf-column-manager components
		@default null
		@readonly
	*/
	columns: null,

	/**
		The grouped and sorted data, actually emited to the view context.
		@property groups
		@type {nf-table-group-controller} an Ember.ArrayController of groups
		@default null
		@readonly
	*/
	groups: null,

	/**
		The collection of columns registered
		@property columns
		@type Array
		@readonly
		@private
	*/
	_columns: function(key, value) { //jshint ignore:line
		return [];
	}.property(),

	sortFn: function() {
		return multiSort(this.get('sortMap'));
	}.property('sortMap.[]'),

	/**
		Gets the an array of sorts, in order to be processed when sorting the rows.
		@property sortMap
		@readonly
		@private
	*/
	sortMap: function(){
		return this.get('_columns').reduce(function(sortMap, col) {
			var direction = col.get('direction');
			if(direction) {
				var sortBy = col.get('sortBy');
				if(sortBy) {
					sortBy = sortBy.replace(/^row\./, '');

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
	}.property('_columns.@each.sortDirection', '_columns.@each.sortBy'),

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

