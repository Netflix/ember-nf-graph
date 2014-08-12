import Ember from 'ember';
import TableColumnRegistrar from '../mixins/table-column-registrar';

export default Ember.Component.extend(TableColumnRegistrar, {
	_register: function(){
		var table = this.nearestWithProperty('isTable');
		table.set('group', this);
		this.set('table', table);
	}.on('init'),

	_unregister: function(){
		this.get('table').set('group', null);
	}.on('willDestroyElement'),
});