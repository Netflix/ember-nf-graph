import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return {
			lineData: generateLineData(0, 0, 2000, 200, 20, 1000),
			lineData2: generateLineData(0, 100, 1000, 100, 500),
			area1: generateLineData(0, 0, 50, 20, 10),
			area2: generateLineData(0, 51, 100, 20, 11),
			area3: generateLineData(0, 101, 150, 20, 10)
		};
	}
});

function generateLineData(xStart, yMin, yMax, variance, count, yStart){
	var p = yStart || 0;
	return d3.range(count).map(function(d, i) {
		var y = p + (Math.random() * variance) - (variance / 2);
		y = Math.min(yMax, Math.max(yMin, y));
		p = y;
		return {
			x: xStart + i,
			y: y
		};
	});
}