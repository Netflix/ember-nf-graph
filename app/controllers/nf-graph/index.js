import Ember from 'ember';

export default Ember.ObjectController.extend({
	xTickFilter: function(tick) {
		return true;
	},

	xTickFactory: function(xScale, tickCount, xData, xScaleType) {
		var ticks = [1, 10, 30, 50, 80, 99];

		return ticks;
	},

	actions: {
		test: function(){
			console.log('test!');
		}
	}
});