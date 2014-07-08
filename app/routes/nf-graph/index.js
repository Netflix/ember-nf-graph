import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		var lineData = [];

		var i, x, y, p;

		for(i = 0, p = 0; i < 300; i++) {
			x = i;
			y = Math.max(0, (p + (Math.random() * 300) - 150));
			p = y;
			lineData.push({ x: x, y: y });
		}

		return {
			lineData: lineData
		};
	}
});