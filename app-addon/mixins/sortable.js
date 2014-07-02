import Ember from 'ember';
import { SORT_ASCENDING, SORT_DESCENDING, SORT_NONE } from '../utils/constants';

export default Ember.Mixin.create({
	isSortable: true,
	sortDirection: SORT_NONE,

	unsort: function(){
		this.set('sortDirection', SORT_NONE);
	},

	sort: function(){
		if(this.sortDirection === SORT_ASCENDING) {
			this.set('sortDirection', SORT_DESCENDING);
		} else {
			this.set('sortDirection', SORT_ASCENDING);
		}
	}
});