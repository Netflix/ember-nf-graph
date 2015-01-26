import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property } from '../utils/computed-property-helpers';
import RequireScaleSource from '../mixins/graph-requires-scale-source';

/**
	Plots a circle at a given x and y domain value on an `nf-graph`.

	@namespace components
	@class nf-dot
	@extends Ember.Component
  @uses mixins.graph-has-graph-parent
	@uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequireScaleSource, {
	tagName: 'circle',

	attributeBindings: ['r', 'cy', 'cx'],

	/**
		The x domain value at which to plot the circle
		@property x
		@type Number
		@default null
	*/
	x: null,
	
	/**
		The y domain value at which to plot the circle
		@property x
		@type Number
		@default null
	*/
	y: null,
	
	/**
		The radius of the circle plotted
		@property r
		@type Number
		@default 2.5
	*/
	r: 2.5,

	hasX: Ember.computed.notEmpty('x'),

	hasY: Ember.computed.notEmpty('y'),

	/**
		The computed center x coordinate of the circle
		@property cx
		@type Number
		@private
		@readonly
	*/
	cx: property('x', 'xScale', 'hasX', function(x, xScale, hasX) {
		return hasX && xScale ? xScale(x) : -1;
	}),

	/**
		The computed center y coordinate of the circle
		@property cy
		@type Number
		@private
		@readonly
	*/
	cy: property('y', 'yScale', 'hasY', function(y, yScale, hasY) {
		return hasY && yScale ? yScale(y) : -1;
	}),

	/**
		Toggles the visibility of the dot. If x or y are
		not numbers, will return false.
		@property isVisible
		@private
		@readonly
	*/
	isVisible: Ember.computed.and('hasX', 'hasY'),
});