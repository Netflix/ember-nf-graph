import Ember from 'ember';

/**
 * Templating component for `nf-table`. Should always be contained in an `nf-column` component.
 * @namespace components
 * @class nf-cell
 */
export default Ember.Component.extend({
	_setup: function(){
		var column = this.nearestWithProperty('isDataTableColumn');
		this.set('column', column);
		column.set('cell', this);
	}.on('init'),

	renderToBuffer: function() {
		//overridden
	}
});