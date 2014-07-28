import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return {
			lineData: generateLineData(0, 0, 2000, 200, 300),
			lineData2: generateLineData(0, 100, 1000, 100, 500)
		};
	}
});

function generateLineData(xStart, yMin, yMax, variance, count){
	var p = 0;
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