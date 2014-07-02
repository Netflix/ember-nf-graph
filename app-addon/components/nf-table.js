import Ember from 'ember';
import multiSort from '../utils/multi-sort';
import { SORT_NONE, SORTTYPE_SINGLE, SORTTYPE_MULTI } from '../utils/constants';

export default Ember.Component.extend({
	isDataTable: true,
	tagName: 'table',
	rows: null,
	
	sortType: SORTTYPE_SINGLE,

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
	}.property('rows.[]', 'columns.@each.sortDirection'),

	parentController: Ember.computed.alias('templateData.view.controller'),

	actions: {
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