import Ember from 'ember';
import Sortable from '../mixins/sortable';

export default Ember.Component.extend(Sortable, {
	tagName: 'tr',
	isDataTableColumn: true,

	_registerWithDataTable: function(){
		var dataTable = this.nearestWithProperty('isDataTable');
		this.set('table', dataTable);
		dataTable.registerColumn(this);
	}.on('init')
});