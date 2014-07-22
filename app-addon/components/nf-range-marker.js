import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import HasGraphParent from '../mixins/graph-has-graph-parent';

/**
 * Draws a rectangular strip with a templated label on an `nf-graph`.
 * Should always be used in conjunction with an `nf-range-markers` container component.
 * @namespace components
 * @class nf-range-marker
 */
export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',

	attributeBindings: ['transform'],

	classNames: ['nf-range-marker'],

	xMin: 0,
	xMax: 0,
	marginTop: 10,
	marginBottom: 3,
	height: 10,

  x: property('xMin', 'graph.xScale', function(xMin, xScale) {
  	return xScale(xMin);
  }),

  width: property('xMin', 'xMax', 'graph.xScale', function(xMin, xMax, xScale) {
  	return xScale(xMax - xMin);
  }),

  y: property('container.orient', 'prevMarker.bottom', 'prevMarker.y', 'graph.graphHeight', 'totalHeight', function(orient, prevBottom, prevY, graphHeight, totalHeight){
  	prevBottom = prevBottom || 0;

  	if(orient === 'bottom') {
  		return (prevY || graphHeight) - totalHeight;
  	}

  	if(orient === 'top') {
  		return prevBottom;
  	}
  }),

  totalHeight: property('height', 'marginTop', 'marginBottom', function(height, marginTop, marginBottom) {
  	return height + marginTop + marginBottom;
  }),

  bottom: property('y', 'totalHeight', function(y, totalHeight) {
  	return y + totalHeight;
  }),

  transform: property('y', function(y) {
  	return 'translate(0 %@)'.fmt(y || 0);
  }),

  labelTransform: property('x', function(x){
  	return 'translate(%@ 0)'.fmt(x || 0);
  }),

	_setup: function(){
		var container = this.nearestWithProperty('isRangeMarkerContainer');
		container.registerMarker(this);
		this.set('container', container);
	}.on('init'),

  _unregister: function() {
    this.get('container').unregisterMarker(this);
  }.on('willDestroyElement')
});