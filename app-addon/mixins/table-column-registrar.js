import Ember from 'ember';

export default Ember.Mixin.create({
	isTableColumnRegistrar: true,

	columns: function(){
		return [];
	}.property(),

	registerColumn: function(column) {
		this.get('columns').pushObject(column);
	},

	unregisterColumn: function(column) {
		this.get('columns').removeObject(column);
	},
})