import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import HasGraphParent from '../mixins/graph-has-graph-parent';

export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',

	// margin in pixels
	margin: 10,

	// xMin in DOMAIN value.
	xMin: 0,

	// xMax in DOMAIN value
	xMax: 0,

	// height in pixels
	height: 0,

	width: property('xMin', 'xMax', 'xScale', function(xMin, xMax, xScale) {
		return xScale(xMax - xMin)
	}),

	x: property('xMin', 'xScale', function(xMin, xScale) {
		return xScale(xMin);
	}),

 	y: property('prevMarker.y', 'margin', 'container.orient', 'graph.graphHeight', 'height',
 		function(prevMarkerY, margin, orient, graphHeight, height) {
			var y = (prevMarkerY || 0) + margin;

			if(orient === 'bottom') {
				y = graphHeight - y - height;
			}

			return y;
		}
	),

	_setup: function(){
		var container = this.nearestWithProperty('isRangeMarkerContainer');
		container.registerMarker(this);
		this.set('container', container);
	}.on('init')
});