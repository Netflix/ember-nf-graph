import Ember from 'ember';
import { property } from '../computed-property-helpers';

/**
	An event context object generally returned by tracking events. Also used as
	`trackedData` in components such as `nf-line`, `nf-area` and `nf-bars`.
	
	@namespace utils.nf
	@class graph-tracking-action-context
*/
export default Ember.Object.extend({
	/**
		The mouse x position on the graph
		@property mouseX
		@type Number
		@default null
	*/
	mouseX: null,

	/**
		The mouse y position on the graph
		@property mouseX
		@type Number
		@default null
	*/	
	mouseY: null,

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
	*/
	nearestData: property('mouseX', 'source', function(mouseX, source) {
		mouseX = +mouseX;
		if(source && mouseX === mouseX) {
			var d = source.getDataNearXRange(mouseX);
			if(d) {
				return {
					x: d[0],
					y: d[1],
					data: d.data,
				};
			}
		}
		return null;
	}),

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
		@property graphPositionX
		@type Number
		@readonly
	*/
	graphPositionX: property('x', 'source.xScale', function(x, xScale) {
		return xScale ? xScale(x) : NaN;
	}),

	/**
		The position of the `y` value on the graph.
		@property graphPositionY
		@type Number
		@readonly
	*/
	graphPositionY: property('y', 'source.yScale', function(y, yScale) {
		return yScale ? yScale(y) : NaN;
	}),

	/**
		If the scale type is `ordinal`, this returns the centered position of `x` on the graph
		@property centerPositionX
		@type Number
		@readonly
	*/
	centerPositionX: property('graphPositionX', 'source.xScale', function(posX, xScale) {
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
	centerPositionY: property('graphPositionY', 'source.yScale', function(posY, yScale) {
		if(!yScale || !yScale.rangeRoundBands) {
			return posY;
		}

		if(posY !== posY) {
			return posY; //NaN
		}

		return posY + (yScale.rangeBand() / 2);
	}),
});