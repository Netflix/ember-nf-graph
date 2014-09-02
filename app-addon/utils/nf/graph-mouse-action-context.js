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
		The component that fired the event.
		@property source
		@type Ember.Component
		@default null
	*/
	source: null,

	/**
		The nf-graph the event originated from
		@property graph
		@type components.nf-graph
		@default null
	*/
	graph: null,

	/**
		The computed x and y coordinate of the mouse within the source component
		@property mousePoint
		@type Object
		@readonly
	*/
	mousePoint: property('source.element', 'originalEvent', function(containerElement, e) {
		if(containerElement && e) {
			return getMousePoint(containerElement, e);
		}
	}),

	/**
		The x position of the mouse relative to the `source`.
		@property mouseX
		@type Number
		@readonly
	*/
	mouseX: Ember.computed.alias('mousePoint.x'),

	/**
		The y position of the mouse relative to the `source`.
		@property mouseY
		@type Number
		@readonly
	*/
	mouseY: Ember.computed.alias('mousePoint.y'),

	/**
		The x domain value at the mouse x position.

		NOTE: Ordinal scales will return NaN.

		@property x
		@type Number
		@readonly
	*/
	x: property('xScale', 'mouseX', function(scale, mouse) {
		return scale && scale.invert ? scale.invert(mouse) : NaN;
	}),

	/**
		The y domain value at the mouse y position.

		NOTE: Ordinal scales will return NaN.
		
		@property y
		@type Number
		@readonly
	*/
	y: property('yScale', 'mouseY', function(scale, mouse) {
		return scale && scale.invert ? scale.invert(mouse) : NaN;
	}),

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