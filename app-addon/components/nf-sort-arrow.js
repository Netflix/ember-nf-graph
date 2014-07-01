import Ember from 'ember';
import { SORT_ASCENDING, SORT_DESCENDING } from '../utils/constants';

export default Ember.Component.extend({
	tagName: 'div',

	classNameBindings: ['sortClass', ':nf-sort-arrow'],
	
	disabled: Ember.computed.alias('sortable.isSortable'),

	sortClass: function(){
		var ssDir = this.get('sortable.sortDirection');
		switch(ssDir) {
			case SORT_ASCENDING:
				return 'nf-sort-arrow-ascending';
			case SORT_DESCENDING:
				return 'nf-sort-arrow-descending';
			default:
				return 'nf-sort-arrow-none';
		}
	}.property('sortable.sortDirection'),

	_setup: function(){
		var sortable = this.nearestWithProperty('isSortable');
		this.set('sortable', sortable);
	}.on('init')
});