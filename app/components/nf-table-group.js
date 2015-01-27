import Ember from 'ember';
import TableColumnRegistrar from 'ember-cli-ember-dvc/mixins/table-column-registrar';

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

	/**
		The name of the action to send when the group row is clicked.
		Sends an object with `group`, `table` and `tableGroup` which are
		the group data, the table component, and the table-group component, respectively.
		@property rowAction
		@type String
		@default null
	*/
	rowAction: null,

	_register: function(){
		var table = this.nearestWithProperty('isTable');
		table.set('tableGroup', this);
		this.set('table', table);
	}.on('init'),

	_unregister: function(){
		this.get('table').set('tableGroup', null);
	}.on('willDestroyElement'),
});