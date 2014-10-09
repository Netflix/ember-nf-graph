import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import RequiresScaleSource from '../mixins/graph-requires-scale-source';

/**
	A rectangle that plots using domain values from the graph. Uses an SVGPathElement
	to plot the rectangle, to allow for rectangles with "negative" heights.
*/
export default Ember.Component.extend(HasGraphParent, RequiresScaleSource, {
	tagName: 'path',

	attributeBindings: ['d'],

	classNames: ['nf-rect'],

	/**
		The domain x value to place the rect at.
		@property x
		@default null
	*/
	x: null,

	/**
		The domain y value to place the rect at.
		@property y
		@default null
	*/
	y: null,

	_width: 0,

	/**
		The width as a domain value. If xScale is ordinal, 
		then this value is the indice offset to which to draw the 
		rectangle. In other words, if it's `2`, then draw the rectangle
		to two ordinals past whatever `x` is set to.
		@property width
		@type Number
		@default 0
	*/
	width: function(key, value) {
		if(arguments.length > 1) {
			this._width = +value;
		}
		return this._width;
	}.property(),

	_height: 0,

	/**
		The height as a domain value. If the yScale is ordinal,
		this value is the indice offset to which to draw the rectangle.
		For example, if the height is `3` then draw the rectangle
		to two ordinals passed whatever `y` is set to.
		@property height
		@type Number
		@default 0
	*/
	height: function(key, value) {
		if(arguments.length > 1) {
			this._height = +value;
		}
		return this._height;
	}.property(),

	x1: function(){
		var xScale = this.get('xScale');
		var w = this.get('width');
		var x = this.get('x');
		if(xScale.rangeBands) {
			var domain = xScale.domain();
			var fromIndex = domain.indexOf(x);
			var toIndex = fromIndex + w;
			return normalizeScale(xScale, domain[toIndex]);
		} else {
			x = +x || 0;
			return normalizeScale(xScale, w + x);
		}
	}.property('width', 'x', 'xScale'),

	y1: function(){
		var yScale = this.get('yScale');
		var h = this.get('height');
		var y = this.get('y');
		if(yScale.rangeBands) {
			var domain = yScale.domain();
			var fromIndex = domain.indexOf(y);
			var toIndex = fromIndex + h;
			return normalizeScale(yScale, domain[toIndex]);
		} else {
			y = +y || 0;
			return normalizeScale(yScale, h + y);
		}
	}.property('height', 'y', 'yScale'),

	x0: function(){
		return normalizeScale(this.get('xScale'), this.get('x'));
	}.property('x', 'xScale'),

	y0: function() {
		return normalizeScale(this.get('yScale'), this.get('y'));
	}.property('y', 'yScale'),

	d: function(){
		var x0 = this.get('x0');
		var y0 = this.get('y0');
		var x1 = this.get('x1');
		var y1 = this.get('y1');
		return 'M%@1,%@2 L%@1,%@4 L%@3,%@4 L%@3,%@2 L%@1,%@2'.fmt(x0, y0, x1, y1);
	}.property('x0', 'y0', 'x1', 'y1'),
});

function normalizeScale(scale, val) {
	return (scale ? scale(val) : 0) || 0;
}