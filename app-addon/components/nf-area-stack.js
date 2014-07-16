import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'g',
	isAreaStack: true,

	areas: function(){
		return [];
	}.property(),

	registerArea: function(area) {
		var areas = this.get('areas');
		var last = areas[areas.length - 1];
		if(last) {
			last.set('nextArea', area);
		}
		
		areas.pushObject(area);
	},

	unregisterArea: function(area) {
		this.get('areas').removeObject(area);
	},
});