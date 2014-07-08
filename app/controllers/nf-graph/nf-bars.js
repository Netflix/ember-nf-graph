import Ember from 'ember';

export default Ember.ObjectController.extend({
	data: function() {
		var p = { y: 0 }
		return d3.range(100).map(function(p, n) {
			var y = p.y + Math.max(0, (Math.random() * 300)  - 150);
			return p = {
				x: n,
				y: y
			};
		});
	}.property()
});