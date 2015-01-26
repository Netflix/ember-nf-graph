import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import RequiresScaleSource from '../mixins/graph-requires-scale-source';
import { normalizeScale } from '../utils/nf/scale-utils';
import SelectableGraphic from '../mixins/graph-selectable-graphic';

/**
	Draws a basic line between two points on the graph. 
	@namespace components
	@class nf-svg-line
	@extends Ember.Component
	@uses mixins.graph-has-graph-parent
	@uses mixins.graph-requires-scale-source
	@uses mixins.graph-selectable-graphic
*/
export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, SelectableGraphic, {
	tagName: 'line',

	classNameBindings: [':nf-svg-line', 'selectable', 'selected'],

	attributeBindings: ['svgX1:x1', 'svgX2:x2', 'svgY1:y1', 'svgY2:y2'],

	click: function(){
		if(this.get('selectable')) {
			this.toggleProperty('selected');
		}
	},

	/**
		The domain value to plot the SVGLineElement's x1 at.
		@property x1
		@default null
	*/
	x1: null,

	/**
		The domain value to plot the SVGLineElement's x2 at.
		@property x2
		@default null
	*/
	x2: null,

	/**
		The domain value to plot the SVGLineElement's y1 at.
		@property y1
		@default null
	*/
	y1: null,

	/**
		The domain value to plot the SVGLineElement's y2 at.
		@property y2
		@default null
	*/
	y2: null,

	/**
		The pixel value to plot the SVGLineElement's x1 at.
		@property svgX1
		@type Number
	*/
	svgX1: function(){
		return normalizeScale(this.get('xScale'), this.get('x1'));
	}.property('x1', 'xScale'),
	
	/**
		The pixel value to plot the SVGLineElement's x2 at.
		@property svgX2
		@type Number
	*/
	svgX2: function(){
		return normalizeScale(this.get('xScale'), this.get('x2'));
	}.property('x2', 'xScale'),

	/**
		The pixel value to plot the SVGLineElement's y1 at.
		@property svgY1
		@type Number
	*/
	svgY1: function(){
		return normalizeScale(this.get('yScale'), this.get('y1'));
	}.property('y1', 'yScale'),
	
	/**
		The pixel value to plot the SVGLineElement's y2 at.
		@property svgY2
		@type Number
	*/
	svgY2: function(){
		return normalizeScale(this.get('yScale'), this.get('y2'));
	}.property('y2', 'yScale'),
});
