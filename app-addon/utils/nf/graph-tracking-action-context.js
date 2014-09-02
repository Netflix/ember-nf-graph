import Ember from 'ember';
import { property } from '../computed-property-helpers';

export default Ember.Object.extend({
	mouseX: null,

	mouseY: null,

	source: null,

	graph: null,

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

	x: Ember.computed.oneWay('nearestData.x'),

	y: Ember.computed.oneWay('nearestData.y'),

	data: Ember.computed.oneWay('nearestData.data'),

	graphPositionX: property('x', 'source.xScale', function(x, xScale) {
		return xScale ? xScale(x) : NaN;
	}),

	graphPositionY: property('y', 'source.yScale', function(y, yScale) {
		return yScale ? yScale(y) : NaN;
	}),

	centerPositionX: property('graphPositionX', 'source.xScale', function(posX, xScale) {
		if(!xScale || !xScale.rangeRoundBands) {
			return posX;
		}

		if(posX !== posX) {
			return posX; //NaN
		}

		return posX + (xScale.rangeBand() / 2);
	}),

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