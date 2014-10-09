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

	/**
		The width as a domain value
		@property width
		@default null
	*/
	width: null,

	/**
		The height as a domain value
		@property height
		@default null
	*/
	height: null,

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

	/**
		The computed x pixel position of the image.
		@property svgX
		@type Number
		@readonly
	*/
	svgX: function(){
		var scale = this.get('xScale');
		return (scale ? scale(this.get('x')) : 0) || 0;
	}.property('x', 'xScale'),

	/**
		The computed y pixel position of the image.
		@property svgY
		@type Number
		@readonly
	*/
	svgY: function(){
		var scale = this.get('yScale');
		return (scale ? scale(this.get('y')) : 0) || 0;
	}.property('y', 'yScale'),

	/**
		The computed width in pixels of the image.
		@property svgWidth
		@type Number
		@readonly
	*/
	svgWidth: function(){
		var scale = this.get('xScale');
		return (scale ? scale(this.get('width')) : 0) || 0;
	}.property('width', 'xScale'),

	/**
		The computed height in pixels of the image.
		@property svgHeight
		@type Number
		@readonly
	*/
	svgHeight: function(){
		var scale = this.get('yScale');
		return (scale ? scale(this.get('height')) : 0) || 0;
	}.property('height', 'yScale'),
});