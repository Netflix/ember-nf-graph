import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		var data = d3.range(100).map(function(n) {
			return {
				y: Math.sin(n / 10)
			};
		});

		return {
			data: data
		};
	}
});