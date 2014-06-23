import Ember from 'ember';
export default Ember.Mixin.create({
	isRegisteredGraphic: true,
	isRegistered: false,

	_registerGraphic: function() {
		var graph = this.get('graph');
		if(graph) {
			graph.registerGraphic(this);
		}
	}.on('didInsertElement'),

	_unregisterGraphic: function(){
		var graph = this.get('graph');
		if(graph) {
			graph.unregisterGraphic(this);
		}
	}.on('willDestroyElement')
});