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
		if(arguments.length > 1) {
			this._graphX = value;
			var scale = this.get('xScale');
			this._x = scale && scale.invert ? scale.invert(value) : NaN;
		}
		return this._graphX;
	}.property('x'),

	/**
		The y position relative to the graph
		@property graphY
		@type Number
	*/
	graphY: function(key, value) {
		if(arguments.length > 1) {
			this._graphY = value;
			var scale = this.get('yScale');
			this._y = scale && scale.invert ? scale.invert(value) : NaN;
		}
		return this._graphY;
	}.property('y'),

	/**
		The x domain value
		@property x
		@type Number
	*/
	x: function(key, value) {
		if(arguments.length > 1) {
			this._x = value;
			var scale = this.get('xScale');
			if(scale) {
				this._graphX = scale ? scale(value) : NaN;
			}
		}
		return this._x;
	}.property('graphX'),

	/**
		The y domain value
		@property y
		@type Number
	*/
	y: function(key, value) {
		if(arguments.length > 1) {
			this._y = value;
			var scale = this.get('yScale');
			this._graphY = scale ? scale(value) : NaN;
		}
		return this._y;
	}.property('graphY'),

	/**
		The x position relative to the document
		@property pageX
		@type Number
	*/
	pageX: function(){
		var offset = this.get('graphOffset');
		if(offset) {
			var graphX = this.get('graphX') || 0;
			var graphContentX = this.get('graph.graphX') || 0;
			return offset.left + graphX + graphContentX;
		}
	}.property('graphX', 'graphOffset', 'graph.graphX').readOnly(),

	/**
		The y position relative to the document
		@property pageY
		@type Number
	*/
	pageY: function(){
		var offset = this.get('graphOffset');
		if(offset) {
			var graphY = this.get('graphY') || 0;
			var graphContentY = this.get('graph.graphY') || 0;
			return offset.top + graphY + graphContentY;
		}
	}.property('graphY', 'graphOffset', 'graph.graphY').readOnly(),

	/**
		The x scale from either the source or graph used to calculate positions
		@property xScale
		@type d3.scale
		@readonly
	*/
	xScale: function(){
		return this.get('source.xScale') || this.get('graph.xScale');
	}.property('graph.xScale', 'source.xScale').readOnly(),

	/**
		The y scale from either the source or graph used to calculate positions
		@property yScale
		@type d3.scale
		@readonly
	*/
	yScale: function(){
		return this.get('source.yScale') || this.get('graph.yScale');
	}.property('graph.yScale', 'source.yScale').readOnly(),

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
	}.property('graph').readOnly(),
});