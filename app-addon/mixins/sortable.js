import Ember from 'ember';
import { SORT_NONE } from '../utils/constants';

export default Ember.Mixin.create({
	isSortable: true,
	sortDirection: SORT_NONE
});