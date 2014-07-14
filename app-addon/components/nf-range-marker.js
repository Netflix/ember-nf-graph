import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import HasGraphParent from '../mixins/graph-has-graph-parent';

export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',

	classNames: ['nf-range-marker'],

	xMin: 0,
	xMax: 0,
	topMargin: 15,
	height: 10,

  labelPadding: 3,

	x: property('xMin', 'graph.xScale', function(xMin, xScale) {
		return xScale(xMin);
	}),

	y: property('graphHeight', 'prevMarker.y', 'prevMarker.topMargin', 'prevMarker.topPadding', function(){
		return 0;
	}),

	width: property('xMin', 'xMax', 'graph.xScale', function(xMin, xMax, xScale) {
		return xScale(xMax - xMin);
	}),

	labelTransform: property('x', 'y', 'labelPadding',
		function(x, y, labelPadding) {
			y -= labelPadding;
			return 'translate(%@ %@)'.fmt(x, y);
		}
	),

	_setup: function(){
		var container = this.nearestWithProperty('isRangeMarkerContainer');
		container.registerMarker(this);
		this.set('container', container);
	}.on('init'),
});