import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import HasGraphParent from '../mixins/graph-has-graph-parent';

/**
	Draws a vertical line on a graph at a given x domain value
	@namespace components
	@class nf-vertical-line
	@extends Ember.Component
  @uses mixins.graph-has-graph-parent
*/
export default Ember.Component.extend(HasGraphParent, {
	tagName: 'line',

	classNames: ['nf-vertical-line'],

	attributeBindings: ['lineX:x1', 'lineX:x2', 'y1', 'y2'],

	/**
		The top y coordinate of the line
		@property y1
		@type Number
		@default 0
		@private
	*/
	y1: 0,

	/**
		The bottom y coordinate of the line
		@property y2
		@type Number
		@private
		@readonly
	*/
	y2: Ember.computed.alias('graph.graphHeight'),

	/**
		The x domain value at which to draw the vertical line on the graph
		@property x
		@type Number
		@default null
	*/
	x: null,

	/**
		The calculated x coordinate of the vertical line
		@property lineX
		@type Number
		@private
		@readonly
	*/
	lineX: property('x', 'graph.xScale', function(x, xScale) {
		return xScale ? xScale(x) : -1;
	}),
});