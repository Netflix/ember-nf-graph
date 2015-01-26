import Ember from 'ember';

/**
 	Templating component for `nf-table`. Should always be contained in an `nf-column` component.
 	@namespace components
 	@class nf-cell
 	@extends Ember.Component
 */
export default Ember.Component.extend({
	tagName: 'td',

	classNames: ['nf-cell'],
	
	/**
		The number of columns for the output cell to span
		@property colspan
		@type Number
		@default 1
	*/
	colspan: 1,

	_setup: function(){
		var column = this.nearestWithProperty('isDataTableColumn');
		this.set('column', column);
		column.set('cell', this);
	}.on('init'),

	renderToBuffer: function() {
		//overridden
	}
});