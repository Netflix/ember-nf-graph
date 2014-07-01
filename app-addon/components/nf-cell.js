import Ember from 'ember';

export default Ember.Component.extend({
	_setup: function(){
		var column = this.nearestWithProperty('isDataTableColumn');
		this.set('column', column);
		column.set('cell', this);
	}.on('init'),

	renderToBuffer: function() {
		//overridden
	}
});