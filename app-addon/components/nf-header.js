import NfCell from './nf-cell';

/**
	Templating component for `nf-table`. Should always be contained in an `nf-column` component.
	@namespace components
	@class nf-header
	@extends components.nf-cell
*/
export default NfCell.extend({
	tagName: 'th',

	_setup: function(){
		var column = this.nearestWithProperty('isDataTableColumn');
		this.set('column', column);
		column.set('header', this);
	}.on('init'),
});