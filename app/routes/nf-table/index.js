import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		var myData = [];
		var i;

		for(i = 0; i < 20; i++) {
			myData.push({
				id: i+1,
				foo: Math.random() * 100,
				bar: 'Bar ' + i,
				blah: 'Blah' + (i % 2),
			});
		}

		return {
			myData: myData
		};
	}
});