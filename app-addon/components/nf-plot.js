import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';

/**
	Plots a group tag on a graph at a given x and y domain coordinate.
	@namespace components
	@class nf-plot
	@extends Ember.Component
	@uses mixins.graph-has-graph-parent
*/
export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',

	attributeBindings: ['transform'],

	classNames: ['nf-plot'],

	/**
		The x domain value to set the plot at
		@property x
		@default null
	*/
	x: null,

	/**
		The y domain value to set the plot at
		@property x
		@default null
	*/
	y: null,

	/**
		The calculated visibility of the component
		@property isVisible
		@type Boolean
		@readonly
	*/
	isVisible: function(){
		var x = this.get('x');
		var y = this.get('y');
		return !(isNaN(x) && isNaN(y));
	}.property('x', 'y'),

	/**
		The calculated x coordinate
		@property rangeX
		@type Number
		@readonly
	*/
	rangeX: function(){
		var xScale = this.get('graph.xScale');
		var x = this.get('x');
		return (xScale ? xScale(x) : 0) || 0;
	}.property('x', 'graph.xScale'),

	/**
		The calculated y coordinate
		@property rangeY
		@type Number
		@readonly
	*/
	rangeY: function(){
		var yScale = this.get('graph.yScale');
		var y = this.get('y');
		return (yScale ? yScale(y) : 0) || 0;
	}.property('y', 'graph.yScale'),

	/**
		The SVG transform of the component's `<g>` tag.
		@property transform
		@type String
		@readonly
	*/
	transform: function(){
		return 'translate(%@ %@)'.fmt(this.get('rangeX'), this.get('rangeY'));
	}.property('rangeX', 'rangeY'),
});