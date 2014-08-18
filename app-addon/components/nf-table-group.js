import Ember from 'ember';
import TableColumnRegistrar from '../mixins/table-column-registrar';

/**
	A component for defining a grouping row on an `nf-table`.
	@namespace components
	@class nf-table-group
	@uses mixins.table-column-registrar
*/
export default Ember.Component.extend(TableColumnRegistrar, {
	/**
		The name of the item controller to use for each grouping.
		@property itemController
	*/
	itemController: undefined,

	_register: function(){
		var table = this.nearestWithProperty('isTable');
		table.set('tableGroup', this);
		this.set('table', table);
	}.on('init'),

	_unregister: function(){
		this.get('table').set('tableGroup', null);
	}.on('willDestroyElement'),
});