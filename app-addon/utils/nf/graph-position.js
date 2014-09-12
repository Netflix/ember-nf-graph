import Ember from 'ember';

/**
	Position calculation class for nf-graph related events
	@namespace utils.nf
	@class graph-position
	@extends Ember.Object
*/
export default Ember.Object.extend({
	/**
		@property graph
		@type component.nf-graph
		@default null
	*/
	graph: null,

	/**
		@property source
		@type Ember.Component
	*/
	source: null,

	/**
		The x position relative to graph
		@property graphX
		@type Number
	*/
	graphX: function(key, value) {
		var x = this._x;
		if(arguments.length > 1) {
			this._graphX = value;
		} else {
			var scale = this.get('xScale');
			if(scale) {
				this._graphX = scale(x);
			}
		}
		return this._graphX || NaN;
	}.property('x', 'xScale'),

	/**
		The y position relative to graph
		@property graphY
		@type Number
	*/
	graphY: function(key, value) {
		var y = this._y;
		if(arguments.length > 1) {
			this._graphY = value;
		} else {
			var scale = this.get('yScale');
			if(scale) {
				this._graphY = scale(y);
			}
		}
		return this._graphY || NaN;
	}.property('y', 'yScale'),

	/**
		The x domain value
		@property x
		@type Number
	*/
	x: function(key, value) {
		var graphX = this._graphX;
		if(arguments.length > 1) {
			this._x = value;
		} else {
			var scale = this.get('xScale');
			if (scale && scale.invert){
				this._x = scale.invert(graphX);
			} 
		}
		return this._x || NaN;
	}.property('graphX', 'xScale'),

	/**
		The y domain value
		@property y
		@type Number
	*/
	y: function(key, value) {
		var graphY = this._graphY;
		if(arguments.length > 1) {
			this._y = value;
		} else {
			var scale = this.get('yScale');
			if (scale && scale.invert){
				this._y = scale.invert(graphY);
			} 
		}
		return this._y || NaN;
	}.property('graphY', 'yScale'),

	/**
		The x position relative to the document
		@property pageX
		@type Number
	*/
	pageX: function(){
		var offset = this.get('graphOffset');
		if(offset) {
			var graphX = this.get('graphX') || 0;
			var graphContentX = this.get('graphContentX') || 0;
			return offset.left + graphX + graphContentX;
		}
	}.property('graphX', 'graphOffset', 'graphContentX'),

	/**
		The y position relative to the document
		@property pageY
		@type Number
	*/
	pageY: function(){
		var offset = this.get('graphOffset');
		if(offset) {
			var graphY = this.get('graphY') || 0;
			var graphContentY = this.get('graphContentY') || 0;
			return offset.top + graphY + graphContentY;
		}
	}.property('graphY', 'graphOffset', 'graphContentY'),

	/**
		The x scale from either the source or graph used to calculate positions
		@property xScale
		@type d3.scale
		@readonly
	*/
	xScale: function(){
		return this.get('source.xScale') || this.get('graph.xScale');
	}.property('graph.xScale', 'source.xScale'),

	/**
		The y scale from either the source or graph used to calculate positions
		@property yScale
		@type d3.scale
		@readonly
	*/
	yScale: function(){
		return this.get('source.yScale') || this.get('graph.yScale');
	}.property('graph.yScale', 'source.yScale'),

	/**
		The JQuery offset of the graph element
		@property graphOffset
		@type Object
		@readonly
	*/
	graphOffset: function(){
		var graph = this.get('graph');
		if(graph) {
			var content = graph.$('.nf-graph-content');
			return content ? content.offset() : undefined;
		}
	}.property('graph'),

	/**
		The center point at x. Use in case of requiring a center point 
		and using ordinal scale.
		@property centerX
		@type Number
	*/
	centerX: function(){
		var scale = this.get('xScale');
		var graphX = this.get('graphX');
		if(scale && scale.rangeBand) {
			var rangeBand = scale.rangeBand();
			return graphX + (rangeBand / 2);
		}
		return graphX;
	}.property('xScale', 'graphX'),

	/**
		The center point at y. Use in case of requiring a center point 
		and using ordinal scale.
		@property centerY
		@type Number
	*/
	centerY: function(){
		var scale = this.get('yScale');
		var graphY = this.get('graphY');
		if(scale && scale.rangeBand) {
			var rangeBand = scale.rangeBand();
			return graphY + (rangeBand / 2);
		}
		return graphY;
	}.property('yScale', 'graphY'),

	/**
		The x position of the nf-graph-content within the nf-graph
		@property _graphContentX
		@type Number
		@private
	*/
	_graphContentX: Ember.computed.oneWay('graph.graphX'),

	/**
		The y position of the nf-graph-content within the nf-graph
		@property _graphContentY
		@type Number
		@private
	*/
	_graphContentY: Ember.computed.oneWay('graph.graphY'),
});