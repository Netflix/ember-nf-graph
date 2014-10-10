import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import RequiresScaleSource from '../mixins/graph-requires-scale-source';
import { normalizeScale } from '../utils/nf/scale-utils';

/**
	Draws a basic line between two points on the graph. 
	@namespace components
	@class nf-svg-line
	@extends Ember.Component
	@uses mixins.graph-has-graph-parent
	@uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, {
	tagName: 'line',

	classNames: ['nf-svg-line'],

	attributeBindings: ['svgX0', 'svgX1', 'svgY0', 'svgY1'],

	/**
		The domain value to plot the SVGLineElement's x0 at.
		@property x0
		@default null
	*/
	x0: null,

	/**
		The domain value to plot the SVGLineElement's x1 at.
		@property x1
		@default null
	*/
	x1: null,

	/**
		The domain value to plot the SVGLineElement's y0 at.
		@property y0
		@default null
	*/
	y0: null,

	/**
		The domain value to plot the SVGLineElement's y1 at.
		@property y1
		@default null
	*/
	y1: null,

	/**
		The pixel value to plot the SVGLineElement's x0 at.
		@property svgX0
		@type Number
	*/
	svgX0: function(){
		return normalizeScale(this.get('xScale'), this.get('x0'));
	}.property('x0', 'xScale'),
	
	/**
		The pixel value to plot the SVGLineElement's x1 at.
		@property svgX1
		@type Number
	*/
	svgX1: function(){
		return normalizeScale(this.get('xScale'), this.get('x1'));
	}.property('x1', 'xScale'),

	/**
		The pixel value to plot the SVGLineElement's y0 at.
		@property svgY0
		@type Number
	*/
	svgY0: function(){
		return normalizeScale(this.get('yScale'), this.get('y0'));
	}.property('y0', 'yScale'),
	
	/**
		The pixel value to plot the SVGLineElement's y1 at.
		@property svgY1
		@type Number
	*/
	svgY1: function(){
		return normalizeScale(this.get('yScale'), this.get('y1'));
	}.property('y1', 'yScale'),
});
