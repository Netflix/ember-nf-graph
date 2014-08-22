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

	diffA: 100,
	diffB: 200,

	actions: {
		test: function(){
			console.log('test!');
		},

		appendAreaData: function(area) {
			var last = area[area.length - 1];
			area.pushObject({ x: last.x + 1, y: last.y });
		},

		showData: function(data) {
			console.log(data);
			this.set('shownData', data);
		},
	}
});