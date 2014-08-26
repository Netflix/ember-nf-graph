import Ember from 'ember';
import { property } from '../computed-property-helpers';

export default Ember.Object.extend({
	mouseX: null,

	mouseY: null,

	source: null,

	graph: null,

	nearestData: property('mouseX', 'source', 'source.xScale', function(mouseX, source, xScale) {
		mouseX = +mouseX;
		if(source && mouseX === mouseX) {
			var x = xScale && xScale.invert ? xScale.invert(mouseX) : NaN;
			var d = source.getDataNearX(x);
			return {
				x: d[0],
				y: d[1],
				data: d.data,
			};
		}
		return null;
	}),

	x: Ember.computed.oneWay('nearestData.x'),

	y: Ember.computed.oneWay('nearestData.y'),

	data: Ember.computed.oneWay('nearestData.data'),
});