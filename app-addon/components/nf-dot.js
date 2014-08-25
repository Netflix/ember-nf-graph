import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property } from '../utils/computed-property-helpers';

/**
	Plots a circle at a given x and y domain value on an `nf-graph`.

	@namespace components
	@class nf-dot
	@extends Ember.Component
  @uses mixins.graph-has-graph-parent
*/
export default Ember.Component.extend(HasGraphParent, {
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

	/**
		The computed center x coordinate of the circle
		@property cx
		@type Number
		@private
		@readonly
	*/
	cx: property('x', 'xScale', function(x, xScale) {
		return !isNaN(x) && xScale ? xScale(x) : -1;
	}),

	/**
		The computed center y coordinate of the circle
		@property cy
		@type Number
		@private
		@readonly
	*/
	cy: property('y', 'yScale', function(y, yScale) {
		return !isNaN(y) && yScale ? yScale(y) : -1;
	}),

	/**
		Toggles the visibility of the dot. If x or y are
		not numbers, will return false.
		@property isVisible
		@private
		@readonly
	*/
	isVisible: property('x', 'y', function(x, y) {
		return !(isNaN(x) || isNaN(y));
	}),
});