import Ember from 'ember';

export default Ember.ObjectController.extend({
	xTickFilter: function(tick) {
		return tick.value % 3 === 0;
	}
});