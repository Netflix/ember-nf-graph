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

	fooData: null,

	actions: {
		brushStart: function(e) {
			console.debug('brush start', e.left.get('x'), e.right.get('x'));
		},
		
		brush: function(e) {
			console.debug('brush ', e.left.get('x'), e.right.get('x'));
		},

		brushEnd: function(e) {
			console.debug('brush end', e.left.get('x'), e.right.get('x'));
		},

		test: function(){
			console.log('test!');
		},

		appendAreaData: function(area) {
			var last = area[area.length - 1];
			area.pushObject({ x: last.x + 1, y: last.y });
		},

		showData: function(e) {
			$('.test-div').remove();
			var testDiv = $('<div class="test-div"/>');

			testDiv.css({
				width: 'auto',
				height: 'auto',
				padding: '10px',
				background: 'white',
				position: 'absolute',
				top: e.get('pagePositionY') + 'px',
				left: e.get('pagePositionX') + 'px',
			});

			testDiv.text(e.data.y);

			testDiv.appendTo('body');

			console.log('showData', e);
		},
	}
});