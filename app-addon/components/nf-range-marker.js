import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import HasGraphParent from '../mixins/graph-has-graph-parent';

/**
  Draws a rectangular strip with a templated label on an `nf-graph`.
  Should always be used in conjunction with an `nf-range-markers` container component.
  @namespace components
  @class nf-range-marker
*/
export default Ember.Component.extend(HasGraphParent, {
	tagName: 'g',

	attributeBindings: ['transform'],

	classNames: ['nf-range-marker'],

  /**
    The parent `nf-range-markers` component.
    @property container
    @type {components.nf-range-markers}
    @default null
  */
  container: null,

  /**
    The minimum domain value for the range to mark.
    @property xMin
    @default 0
  */
	xMin: 0,

  /**
    The maximum domain value for the range to mark.
    @property xMax
    @default 0
  */
	xMax: 0,

  /**
    The spacing above the range marker.
    @property marginTop
    @type Number
    @default 10
  */
	marginTop: 10,

  /**
    The spacing below the range marker.
    @property marginBottom
    @type Number
    @default 3
  */
	marginBottom: 3,

  /**
    The height of the range marker.
    @property height
    @type Number
    @default 10
  */
	height: 10,

  /**
    The computed x position of the range marker.
    @property x
    @type Number
    @readonly
  */
  x: property('xMin', 'graph.xScale', function(xMin, xScale) {
  	return xScale(xMin);
  }),

  /**
    The computed width of the range marker.
    @property width
    @type Number
    @readonly
  */
  width: property('xMin', 'xMax', 'graph.xScale', function(xMin, xMax, xScale) {
  	return xScale(xMax) - xScale(xMin);
  }),

  /**
    The computed y position of the range marker.
    @property y
    @type Number
    @readonly
  */
  y: property('container.orient', 'prevMarker.bottom', 'prevMarker.y', 'graph.graphHeight', 'totalHeight', function(orient, prevBottom, prevY, graphHeight, totalHeight){
  	prevBottom = prevBottom || 0;

  	if(orient === 'bottom') {
  		return (prevY || graphHeight) - totalHeight;
  	}

  	if(orient === 'top') {
  		return prevBottom;
  	}
  }),

  /**
    The computed total height of the range marker including its margins.
    @property totalHeight
    @type Number
    @readonly
  */
  totalHeight: property('height', 'marginTop', 'marginBottom', function(height, marginTop, marginBottom) {
  	return height + marginTop + marginBottom;
  }),

  /**
    The computed bottom of the range marker, not including the bottom margin.
    @property bottom
    @type Number
    @readonly
  */
  bottom: property('y', 'totalHeight', function(y, totalHeight) {
  	return y + totalHeight;
  }),

  /**
    The computed SVG transform of the range marker container
    @property transform
    @type String
    @readonly
  */
  transform: property('y', function(y) {
  	return 'translate(0 %@)'.fmt(y || 0);
  }),

  /**
    The computed SVG transform fo the range marker label container.
    @property labelTransform
    @type String
    @readonly
  */
  labelTransform: property('x', function(x){
  	return 'translate(%@ 0)'.fmt(x || 0);
  }),

  /**
    Initialization function that registers the range marker with its parent 
    and populates the container property
    @method _setup
    @private
  */
	_setup: function(){
		var container = this.nearestWithProperty('isRangeMarkerContainer');
		container.registerMarker(this);
		this.set('container', container);
	}.on('init'),

  /**
    Unregisters the range marker from its parent when the range marker is destroyed.
    @method _unregister
    @private
  */
  _unregister: function() {
    this.get('container').unregisterMarker(this);
  }.on('willDestroyElement')
});