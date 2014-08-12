import Ember from 'ember';
import { SORT_NONE, SORT_ASCENDING, SORT_DESCENDING } from '../utils/constants';

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
	

	_sortDirection: SORT_NONE,

	/**
		Gets or sets the sort direction for the column.

		As a convenence, it accepts either a numeric or string value, and 
		coerces it into the appropriate numeric value.

		Always returns a numeric value

		|short|long|numeric|actual|
		|:--|:--|--:|--:|
		|asc|ascending|1|1|
		|desc|descending|-1|-1|
		|none|(any other string)|0|0|

		@property sortDirection
		@type Number
		@default 0
		@example

		     {{#nf-column sortDirection="asc"}}
	*/
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
		var dir = this.get('sortDirection');
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