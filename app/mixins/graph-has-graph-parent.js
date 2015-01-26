import Ember from 'ember';

/**
	Adds initialization code to graph the `nf-graph` parent
	to a component that is to be contained in an `nf-graph`.

	@namespace mixins
	@class graph-has-graph-parent
	*/
export default Ember.Mixin.create({
	
	/**
		The parent graph for a component.
		@property graph
		@type components.nf-graph
		@default null
		*/
	graph: null,

	/**
		Initalization method that gets the `nf-graph` parent
		and assigns it to `graph`
		
		@method _getGraph
		*/
	_getGraph: function(){
		var graph = this.nearestWithProperty('isGraph');
		this.set('graph', graph);
		this.trigger('hasGraph', graph);
	}.on('init'),
});