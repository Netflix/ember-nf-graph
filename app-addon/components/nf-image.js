import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import RequiresScaleSource from '../mixins/graph-requires-scale-source';

/**
	An image to be displayed in a graph with that takes domain based measurements and
	uses the scale of the graph. Creates an `<image class="nf-image"/>` SVG element.
	@namespace components
	@class ng-image
	@extends Ember.Component
	@uses mixins.graph-has-graph-parent
	@uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, {
	tagName: 'image',

	classNames: ['nf-image'],
	
	//HACK: for now xlink:href needs to be bound elsewhere.
	attributeBindings: ['svgX:x', 'svgY:y', 'svgWidth:width', 'svgHeight:height'],

	/**
		The domain x value to place the image at.
		@property x
		@default null
	*/
	x: null,

	/**
		The domain y value to place the image at.
		@property y
		@default null
	*/
	y: null,

	_width: 0,

	/**
		The width as a domain value
		@property width
		@type Number
		@default 0
	*/
	width: function(key, value) {
		if(arguments.length > 1) {
			this._width = Math.max(0, +value) || 0;
		}
		return this._width;
	}.property(),

	_height: 0,

	/**
		The height as a domain value
		@property height
		@default null
	*/
	height: function(key, value) {
		if(arguments.length > 1) {
			this._height = Math.max(0, +value) || 0;
		}
		return this._height;
	}.property(),

	/**
		The image source url
		@property src
		@type String
	*/
	src: function(key, value) {
		//HACK: because attributeBindings doesn't currently work with namespaced attributes.
		var $elem = this.$();
		if(arguments.length > 1) {
			$elem.attr('xlink:href', value);
		}
		return $elem.attr('xlink:href');
	}.property(),

	x0: function(){
		return normalizeScale(this.get('xScale'), this.get('x'));
	}.property('x', 'xScale'),

	y0: function(){
		return normalizeScale(this.get('yScale'), this.get('y'));
	}.property('y', 'yScale'),

	x1: function(){
		var scale = this.get('xScale');
		if(scale.rangeBands) {
			throw new Error('nf-image does not support ordinal scales');
		}
		return normalizeScale(scale, this.get('width') + this.get('x'));
	}.property('xScale', 'width', 'x'),

	y1: function(){
		var scale = this.get('yScale');
		if(scale.rangeBands) {
			throw new Error('nf-image does not support ordinal scales');
		}
		return normalizeScale(scale, this.get('height') + this.get('y'));
	}.property('yScale', 'height', 'y'),

	svgX: function(){
		return Math.min(this.get('x0'), this.get('x1'));
	}.property('x0', 'x1'),

	svgY: function(){
		return Math.min(this.get('y0'), this.get('y1'));
	}.property('y0', 'y1'),

	svgWidth: function(){
		return Math.abs(this.get('x0') - this.get('x1'));
	}.property('x0', 'x1'),

	svgHeight: function(){
		return Math.abs(this.get('y0') - this.get('y1'));
	}.property('y0', 'y1'),
});

function normalizeScale(scale, val) {
	return (scale ? scale(val) : 0) || 0;
}