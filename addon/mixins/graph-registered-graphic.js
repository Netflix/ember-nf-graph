import Ember from 'ember';

/**
	@namespace mixins
	@class graph-registered-graphic
	@extends Ember.Mixin
*/
export default Ember.Mixin.create({

	/**
		calls {{#crossLink "components.nf-graph/registerGraphic"}}{{/crossLink}} on
		`didInsertElement`.
		@method _registerGraphic
		@private
	*/
	_registerGraphic: function() {
		var graph = this.get('graph');
		if(graph) {
			graph.registerGraphic(this);
		}
	}.on('didInsertElement'),

	/**
		calls {{#crossLink "components.nf-graph/unregisterGraphic"}}{{/crossLink}} on
		`didInsertElement`.
		@method _unregisterGraphic
		@private
	*/
	_unregisterGraphic: function(){
		var graph = this.get('graph');
		if(graph) {
			graph.unregisterGraphic(this);
		}
	}.on('willDestroyElement')
});