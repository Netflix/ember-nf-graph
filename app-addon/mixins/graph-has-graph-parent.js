import Ember from 'ember';
export default Ember.Mixin.create({
	graph: null,

	_getGraph: function(){
		var graph = this.nearestWithProperty('isGraph');
		this.set('graph', graph);
	}.on('init')
});