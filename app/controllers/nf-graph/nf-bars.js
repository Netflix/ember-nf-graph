import Ember from 'ember';

export default Ember.ObjectController.extend({
	data: function() {
		var arr = [];
		var str = 'abcdefg';
		
		for(var i = 0, len = str.length; i < len; i++) {
			arr.push({
				x: str[i],
				y: (i+1) * 100
			});
		}

		return arr;
	}.property()
});