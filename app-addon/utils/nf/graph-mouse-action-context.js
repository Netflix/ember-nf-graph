import Ember from 'ember';
import { getMousePoint } from './svg-dom';
import { property } from '../computed-property-helpers';

/**
	Event context data for mouse hover events.

	@namespace utils.nf
	@class graph-mouse-action-context
*/
export default Ember.Object.extend({
	/**
		The original mouse event
		@property originalEvent
		@type MouseEvent
		@default null
	*/
	originalEvent: null,

	/**
		The computed x and y coordinate of the mouse within the source component
		@property mousePoint
		@type Object
		@readonly
	*/
	mousePoint: function(){
		var source = this.get('source');
		var containerElement = source ? source.get('element') : null;
		var e = this.get('originalEvent');
		if(containerElement && e) {
			return getMousePoint(containerElement, e);
		}
	}.property('source.element', 'originalEvent'),


	/**
		The x domain value at the mouse x position.

		NOTE: Ordinal scales will return NaN.

		@property x
		@type Number
		@readonly
	*/
	x: property('xScale', 'graphPositionX', function(scale, mouse) {
		return scale && scale.invert ? scale.invert(mouse) : NaN;
	}),

	/**
		The y domain value at the mouse y position.

		NOTE: Ordinal scales will return NaN.
		
		@property y
		@type Number
		@readonly
	*/
	y: property('yScale', 'graphPositionY', function(scale, mouse) {
		return scale && scale.invert ? scale.invert(mouse) : NaN;
	}),

	graphPositionX: Ember.computed.oneWay('mousePoint.x'),

	graphPositionY: Ember.computed.oneWay('mousePoint.y'),

	/**
		The xScale used to compute x
		@property xScale
		@type d3.scale
		@readonly
	*/
	xScale: property('source.xScale', 'graph.xScale', function(sourceScale, graphScale) {
		return sourceScale || graphScale;
	}),

	/**
		The yScale used to compute y
		@property yScale
		@type d3.scale
		@readonly
	*/
	yScale: property('source.yScale', 'graph.yScale', function(sourceScale, graphScale) {
		return sourceScale || graphScale;
	}),
});