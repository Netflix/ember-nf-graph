import Ember from 'ember';

export default Ember.ObjectController.extend({
	graphWidth: 400,
	
	xTickFilter: function() {
		return true;
	},

	xTickFactory: function() {
		var ticks = [1, 10, 30, 50, 80, 99];

		return ticks;
	},

	actions: {
		test: function(){
			console.log('test!');
		},

		appendAreaData: function(area) {
			var last = area[area.length - 1];
			area.pushObject({ x: last.x + 1, y: last.y });
		}
	}
});