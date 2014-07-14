import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import HasGraphParent from '../mixins/graph-has-graph-parent';

export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',

	classNames: ['nf-range-marker'],
	classNameBindings: ['labelOrientClass'],

	labelOrientClass: property('labelOrient', function(labelOrient) {
		return 'label-orient-' + labelOrient;
	}),

	xMin: 0,
	xMax: 0,
	margin: 5,
	height: 10,

	labelOrient: 'left',
  labelPadding: 5,

	x: property('xMin', 'graph.xScale', function(xMin, xScale) {
		return xScale(xMin);
	}),

	y: property('prevMarker.y', 'prevMarker.height', 'margin', 'container.orient', 'graph.graphHeight', 'height',
		function(prevMarkerY, prevMarkerHeight, margin, orient, graphHeight, height) {
			if(orient === 'bottom') {
				return (prevMarkerY || graphHeight) - margin - height;
			}
			// otherwise orient === top
			return (prevMarkerY || 0) + (prevMarkerHeight || 0) + margin;
		}
	),

	width: property('xMin', 'xMax', 'graph.xScale', function(xMin, xMax, xScale) {
		return xScale(xMax - xMin);
	}),

	labelTransform: property('labelOrient', 'x', 'y', 'width', 'labelPadding', 'height',
		function(orient, x, y, width, labelPadding, height) {
			if(orient === 'right') {
				x += width + labelPadding;
			} else {
				x -= labelPadding;
			}

			y += height / 2;

			return 'translate(%@ %@)'.fmt(x, y);
		}
	),

	_setup: function(){
		var container = this.nearestWithProperty('isRangeMarkerContainer');
		container.registerMarker(this);
		this.set('container', container);
	}.on('init'),
});