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
	}.on('init'),

	yScale: function(){
		var scale = this.get('graph.yScale');
		var m = +this.get('multiplierY') || 1;
		if(m !== 1) {
			scale = scale.copy();
			var d = scale.domain();
			scale.domain([d[0] / m, d[1] / m]);
		}
		return scale;
	}.property('graph.yScale', 'multiplierY'),

	xScale: function(){
		var scale = this.get('graph.xScale');
		var m = +this.get('multiplierX') || 1;
		if(m !== 1) {
			scale = scale.copy();
			var d = scale.domain();
			scale.domain([d[0] / m, d[1] / m]);
		}
		return scale;
	}.property('graph.xScale', 'multiplierX'),

	multiplierY: 1,

	multiplierX: 1,
});