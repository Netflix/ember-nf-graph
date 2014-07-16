import Ember from 'ember';
import { SORT_NONE, SORT_ASCENDING, SORT_DESCENDING } from '../utils/constants';

export default Ember.Component.extend({
	tagName: 'tr',
	isDataTableColumn: true,
	
	_sortDirection: SORT_NONE,

	sortDirection: function(name, value) {
		if(arguments.length > 1) {
			var typeOfValue = typeof value;
			if(typeOfValue === 'number') {
				if(value > SORT_NONE) {
					value = SORT_ASCENDING;
				} else if(value < SORT_NONE) {
					value = SORT_DESCENDING;
				} else {
					value = SORT_NONE;
				}
			} else if(typeOfValue === 'string') {
				 value = value.toLowerCase();
				 if(value === 'desc' || value === 'descending') {
				 	value = SORT_DESCENDING;
				 } else if (value === 'asc' || value === 'ascending') {
				 	value = SORT_ASCENDING;
				 } else {
				 	value = SORT_NONE;
				 }
			}

			this._sortDirection = value;
		}

		return this._sortDirection || 0;
	}.property(),

	sortClass: function() {
		var dir = this.get('sortDirection');
		return 'nf-sort-' + (['descending', 'none', 'ascending'][dir+1]);
	}.property('sortDirection'),

	_registerWithDataTable: function(){
		var dataTable = this.nearestWithProperty('isDataTable');
		this.set('table', dataTable);
		dataTable.registerColumn(this);
	}.on('init'),

	_unregister: function(){
		this.get('table').unregisterColumn(this);
	}.on('willDestroyElement')
});