import Ember from 'ember';

/**
	Event object for graph events
	@namespace utils.nf
	@class nf-graph-action-context
	@extends Ember.Object
*/
export default Ember.Object.extend({
	/**
		Gets or sets the domain x value
		@property x
		@default null
	*/
	x: null,

	/**
		Gets or sets the domain y value
		@property x
		@default null
	*/
	y: null,

	/**
		The nf-graph component of the event
		@property graph
		@type components.nf-graph
		@default null
	*/
	graph: null,

	/**
		The source component for the event.
		@property source
		@type Ember.Component
		@default null
	*/
	source: null,

	/**
		Item data for the event and/or additional data.
		@property data
		@type Object
		@default null
	*/
	data: null,

	/**
		The x scale used to calculate graph position.
		Comes from `source` if available, otherwise comes from `graph`
		@property xScale
		@type d3.scale
		@readonly
	*/
	xScale: function(){
		return this.get('source.xScale') || this.get('graph.xScale');
	}.property('source.xScale', 'graph.xScale'),

	/**
		The y scale used to calculate graph position.
		Comes from `source` if available, otherwise comes from `graph`
		@property yScale
		@type d3.scale
		@readonly
	*/
	yScale: function(){
		return this.get('source.yScale') || this.get('graph.yScale');
	}.property('source.yScale', 'graph.yScale'),

	/**
		The computed x position of the event relative to the graph content
		@property graphPositionX
		@type Number
		@readonly
	*/
	graphPositionX: function() {
		var xScale = this.get('xScale');
		return xScale ? xScale(this.get('x')) : NaN;
	}.property('xScale', 'x'),

	/**
		The computed y position of the event relative to the graph content
		@property graphPositionY
		@type Number
		@readonly
	*/
	graphPositionY: function() {
		var yScale = this.get('yScale');
		return yScale ? yScale(this.get('y')) : NaN;
	}.property('yScale', 'y'),

	/**
		The jQuery offset of the graph's element
		@property graphOffset
		@type Object
		@readonly
	*/
	graphOffset: function(){
		return this.get('graph').$().offset();
	}.property('graph'),

	/**
		The computed event x position relative to the document
		@property pagePositionX
		@type Number
		@readonly
	*/
	pagePositionX: function(){
		return this.get('graphPositionX') + this.get('graph').get('graphX') + this.get('graphOffset').left;
	}.property('graphPositionX', 'graph.graphX', 'graphOffset'),

	/**
		The computed event y position relative to the document
		@property pagePositionY
		@type Number
		@readonly
	*/
	pagePositionY: function(){
		return this.get('graphPositionY') + this.get('graph').get('graphY') + this.get('graphOffset').top;
	}.property('graphPositionY', 'graph.graphY', 'graphOffset'),
});