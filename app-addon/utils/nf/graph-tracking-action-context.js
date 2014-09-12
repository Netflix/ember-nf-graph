import Ember from 'ember';
import { property } from '../computed-property-helpers';
import { getMousePoint } from './svg-dom';

/**
	An event context object generally returned by tracking events. Also used as
	`trackedData` in components such as `nf-line`, `nf-area` and `nf-bars`.
	
	@namespace utils.nf
	@class graph-tracking-action-context
*/
export default Ember.Object.extend({
	originalEvent: null,

	mousePointFromEvent: function(){
		var e = this.get('originalEvent');
		var graph = this.get('graph');
		if(graph && e.toString() === '[object MouseEvent]') {
			return getMousePoint(graph.$('.nf-graph-container')[0], e);
		}
	}.property('graph', 'originalEvent'),

	/**
		The mouse x position on the graph
		@property mousePositionX
		@type Number
		@default null
	*/
	mousePositionX: function(key, value) {
		var mousePoint = this.get('mousePointFromEvent');

		if(mousePoint) {
			return mousePoint.x;
		}

		if(arguments.length > 1) {
			this._mousePositionX = value;
		}
		return this._mousePositionX;
	}.property('mousePointFromEvent'),

	/**
		The mouse y position on the graph
		@property mousePositionY
		@type Number
		@default null
	*/	
	mousePositionY: function(key, value) {
		var mousePoint = this.get('mousePointFromEvent');

		if(mousePoint) {
			return mousePoint.y;
		}

		if(arguments.length > 1) {
			this._mousePositionY = value;
		}
		return this._mousePositionY;
	}.property('mousePointFromEvent'),

	mouseX: function(){
		var xScale = this.get('xScale');
		return xScale && xScale.invert ? xScale.invert(this.get('mousePositionX')) : NaN;
	}.property('mousePositionX', 'xScale').readOnly(),

	mouseY: function(){
		var yScale = this.get('yScale');
		return yScale && yScale.invert ? yScale.invert(this.get('mousePositionY')) : NaN;
	}.property('mousePositionY', 'yScale').readOnly(),

	/**
		The component that triggered the event
		@property source
		@type Ember.Component
		@default null
	*/
	source: null,

	/**
		The graph that the event belongs to
		@property graph
		@type components.nf-graph
		@default null
	*/
	graph: null,

	/**
		The data calculated to be nearest to the mouse x position.
		@propert nearestData
		@type Object
		@readonly
		@private
	*/
	nearestData: function() {
		var mousePositionX = this.get('mousePositionX');
		var source = this.get('source');
		mousePositionX = +mousePositionX;
		if(source && mousePositionX === mousePositionX) {
			var d = source.getDataNearXRange(mousePositionX);
			if(d) {
				return {
					x: d[0],
					y: d[1],
					data: d.data,
				};
			}
		}
		return null;
	}.property('mousePositionX', 'source').readOnly(),

	/**
		The x value nearest to the mouse x position
		@property x
		@readonly
	*/
	x: Ember.computed.oneWay('nearestData.x'),

	/**
		The y value nearest to the mouse x position
		@property y
		@readonly
	*/
	y: Ember.computed.oneWay('nearestData.y'),

	/**
		The data nearest to the mouse x position
		@property data
		@readonly
	*/
	data: Ember.computed.oneWay('nearestData.data'),

	/**
		The position of the `x` value on the graph.
		@property positionX
		@type Number
		@readonly
	*/
	positionX: property('x', 'source.xScale', function(x, xScale) {
		return xScale ? xScale(x) : NaN;
	}),

	/**
		The position of the `y` value on the graph.
		@property positionY
		@type Number
		@readonly
	*/
	positionY: property('y', 'source.yScale', function(y, yScale) {
		return yScale ? yScale(y) : NaN;
	}),

	/**
		If the scale type is `ordinal`, this returns the centered position of `x` on the graph
		@property centerPositionX
		@type Number
		@readonly
	*/
	centerPositionX: property('positionX', 'source.xScale', function(posX, xScale) {
		if(!xScale || !xScale.rangeRoundBands) {
			return posX;
		}

		if(posX !== posX) {
			return posX; //NaN
		}

		return posX + (xScale.rangeBand() / 2);
	}),

	/**
		If the scale type is `ordinal`, this returns the centered position of `y` on the graph
		@property centerPositionY
		@type Number
		@readonly
	*/
	centerPositionY: property('positionY', 'source.yScale', function(posY, yScale) {
		if(!yScale || !yScale.rangeRoundBands) {
			return posY;
		}

		if(posY !== posY) {
			return posY; //NaN
		}

		return posY + (yScale.rangeBand() / 2);
	}),
});