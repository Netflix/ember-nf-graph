import Ember from 'ember';

export default Ember.Component.extend({
	tagName: 'th',

	_setup: function(){
		var column = this.nearestWithProperty('isDataTableColumn');
		this.set('column', column);
		column.set('header', this);
	}.on('init'),

	renderToBuffer: function() {
		//overridden
	}
});