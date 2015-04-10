import Ember from 'ember';
import HasGraphParent from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import RequireScaleSource from 'ember-cli-nf-graph/mixins/graph-requires-scale-source';

/**
  Draws a rectangular strip with a templated label on an `nf-graph`.
  Should always be used in conjunction with an `nf-range-markers` container component.
  @namespace components
  @class nf-range-marker
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequireScaleSource, {
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
  x: Ember.computed('xMin', 'xScale', function(){
    var xScale = this.get('xScale');
    var xMin = this.get('xMin');
    return xScale(xMin);
  }),

  /**
    The computed width of the range marker.
    @property width
    @type Number
    @readonly
  */
  width: Ember.computed('xScale', 'xMin', 'xMax', function() {
    var xScale = this.get('xScale');
    var xMax = this.get('xMax');
    var xMin = this.get('xMin');
    return xScale(xMax) - xScale(xMin);
  }),

  /**
    The computed y position of the range marker.
    @property y
    @type Number
    @readonly
  */
  y: Ember.computed(
    'container.orient',
    'prevMarker.bottom',
    'prevMarker.y',
    'graph.graphHeight',
    'totalHeight',
    function() {
      var orient = this.get('container.orient');
      var prevBottom = this.get('prevMarker.bottom');
      var prevY = this.get('prevMarker.y');
      var graphHeight = this.get('graph.graphHeight');
      var totalHeight = this.get('totalHeight');

      prevBottom = prevBottom || 0;

      if(orient === 'bottom') {
        return (prevY || graphHeight) - totalHeight;
      }

      if(orient === 'top') {
        return prevBottom;
      }
    }
  ),

  /**
    The computed total height of the range marker including its margins.
    @property totalHeight
    @type Number
    @readonly
  */
  totalHeight: Ember.computed('height', 'marginTop', 'marginBottom', function() {
    var height = this.get('height');
    var marginTop = this.get('marginTop');
    var marginBottom = this.get('marginBottom');
    return height + marginTop + marginBottom;
  }),

  /**
    The computed bottom of the range marker, not including the bottom margin.
    @property bottom
    @type Number
    @readonly
  */
  bottom: Ember.computed('y', 'totalHeight', function(){
    var y = this.get('y');
    var totalHeight = this.get('totalHeight');
    return y + totalHeight;
  }),

  /**
    The computed SVG transform of the range marker container
    @property transform
    @type String
    @readonly
  */
  transform: Ember.computed('y', function(){ 
    var y = this.get('y');
    return 'translate(0 %@)'.fmt(y || 0);
  }),

  /**
    The computed SVG transform fo the range marker label container.
    @property labelTransform
    @type String
    @readonly
  */
  labelTransform: Ember.computed('x', function(){
    var x = this.get('x');
    return 'translate(%@ 0)'.fmt(x || 0);
  }),

  /**
    Initialization function that registers the range marker with its parent 
    and populates the container property
    @method _setup
    @private
  */
  _setup: Ember.on('init', function(){
    var container = this.nearestWithProperty('isRangeMarkerContainer');
    container.registerMarker(this);
    this.set('container', container);
  }),

  /**
    Unregisters the range marker from its parent when the range marker is destroyed.
    @method _unregister
    @private
  */
  _unregister: Ember.on('willDestroyElement', function() {
    this.get('container').unregisterMarker(this);
  })
});