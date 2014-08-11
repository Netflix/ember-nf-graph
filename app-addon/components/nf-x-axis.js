import Ember from 'ember';
import HasGraphParent from '../mixins/graph-has-graph-parent';
import { property } from '../utils/computed-property-helpers';

/**
  A component for adding a templated x axis to an `nf-graph` component.
  All items contained within this component are used to template each tick mark on the 
  rendered graph. Tick values are supplied to the inner scope of this component on the
  view template via `tick`.
  
  ### Styling
  
  The main container will have a `nf-x-axis` class.
  A `orient-top` or `orient-bottom` container will be applied to the container
  depending on the `orient` setting.

  Ticks are positioned via a `<g>` tag, that will contain whatever is passed into it via
  templating, along with the tick line. `<text>` tags within tick templates do have some 
  default styling applied to them to position them appropriately based off of orientation.

  ### Example 

        {{#nf-graph width=500 height=300}}
          {{#nf-x-axis height=40}}
            <text>x is {{tick.value}}</text>
          {{/nf-x-axis}}
        {{/nf-graph}}


  @namespace components
  @class nf-x-axis
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
*/
export default Ember.Component.extend(HasGraphParent, {
  tagName: 'g',

  attributeBindings: ['transform'],
  classNameBindings: ['orientClass'],
  classNames: ['nf-x-axis'],

  /**
    The height of the x axis in pixels.
    @property height
    @type Number
    @default 20
  */
  height: 20,

  /**
    The number of ticks to display
    @property tickCount
    @type Number
    @default 12
  */
  tickCount: 12,

  /**
    The length of the tick line (the small vertical line indicating the tick)
    @property tickLength
    @type Number
    @default 0
  */
  tickLength: 0,

  /**
    The spacing between the end of the tick line and the origin of the templated 
    tick content
    @property tickPadding
    @type Number
    @default 5
  */
  tickPadding: 5,

  /**
    The orientation of the x axis. Value can be `'top'` or `'bottom'`.
    @property orient
    @type String
    @default 'bottom'
  */
  orient: 'bottom',  
  
  _tickFilter: null,

  /**
    An optional filtering function to allow more control over what tick marks are displayed.
    The function should have exactly the same signature as the function you'd use for an
    `Array.prototype.filter()`.
  
    @property tickFilter
    @type Function
    @default null
    @example
  
          {{#nf-x-axis tickFilter=myFilter}} 
            <text>{{tick.value}}</text>
          {{/nf-x-axis}}
  
    And on your controller:
    
          myFilter: function(tick, index, ticks) {
            return tick.value < 1000;
          },
  
    The above example will filter down the set of ticks to only those that are less than 1000.
  */
  tickFilter: Ember.computed.alias('_tickFilter'),

  /**
    The class applied due to orientation (e.g. `'orient-top'`)
    @property orientClass
    @type String
    @readonly
  */
  orientClass: function(){
    return 'orient-' + this.get('orient');
  }.property('orient'),

  /**
    The SVG Transform applied to this component's container.
    @property transform
    @type String
    @readonly
  */
  transform: function(){
    var x = this.get('x') || 0;
    var y = this.get('y') || 0;
    return 'translate(%@ %@)'.fmt(x, y);
  }.property('x', 'y'),

  /** 
    The y position of this component's container.
    @property y
    @type Number
    @readonly
  */
  y: function(){
    var orient = this.get('orient');
    var graphHeight = this.get('graph.height');
    var height = this.get('height');
    var paddingBottom = this.get('graph.paddingBottom');
    var paddingTop = this.get('graph.paddingTop');
    var y;
    
    if(orient === 'bottom') {
      y = graphHeight - paddingBottom - height;
    } else {
      y = paddingTop;
    }

    return y || 0;
  }.property('orient', 'graph.paddingTop', 'graph.paddingBottom', 'graph.height', 'height'),

  /**
    This x position of this component's container
    @property x
    @type Number
    @readonly
  */
  x: function(){
    return this.get('graph.graphX') || 0;
  }.property('graph.graphX'),


  /**
    The width of the component
    @property width
    @type Number
    @readonly
  */
  width: Ember.computed.alias('graph.graphWidth'),

  /**
    Function to create the tick values. Can be overriden to provide specific values.
    @method tickFactory
    @param xScale {Function} a d3 scale function
    @param tickCount {Number} the number of ticks desired
    @param uniqueXData {Array} all x data represented, filted to be unique (used for ordinal cases)
    @param xScaleType {String} the scale type of the containing graph.
    @return {Array} an array of domain values at which ticks should be placed.
  */
  tickFactory: function(xScale, tickCount, uniqueXData, xScaleType) {
    return (xScaleType === 'ordinal') ? uniqueXData : xScale.ticks(tickCount);
  },

  /**
    A unique set of all x data on the graph
    @property uniqueXData
    @type Array
    @readonly
  */
  uniqueXData: Ember.computed.uniq('graph.xData'),

  /**
    The models for the ticks to display on the axis.
    @property ticks
    @type Array
    @readonly
  */
  ticks: property('tickCount', 'graph.xScale', 'tickPadding', 'tickLength', 'height', 'orient', 'tickFilter', 'graph.xScaleType', 'uniqueXData',
    function(tickCount, xScale, tickPadding, tickLength, height, orient, tickFilter, xScaleType, uniqueXData) {
      var ticks = this.tickFactory(xScale, tickCount, uniqueXData, xScaleType);
      var y1 = orient === 'top' ? height : 0;
      var y2 = y1 + tickLength;
      var labely = orient === 'top' ? (y1 - tickPadding) : (y1 + tickPadding);  
      var halfBandWidth = (xScaleType === 'ordinal') ? xScale.rangeBand() / 2 : 0;
      var result = ticks.map(function(tick) {
        return {
          value: tick,
          x: xScale(tick) + halfBandWidth,
          y1: y1,
          y2: y2,
          labely: labely
        };
      });

      if(tickFilter) {
        result = result.filter(tickFilter);
      }

      return result;
    }
  ),

  /**
    Updates the graph's xAxis property on willInsertElement
    @method _updateGraphXAxis
    @private
  */
  _updateGraphXAxis: function(){
    this.set('graph.xAxis', this);
  }.on('willInsertElement'),

  /**
    The y position, in pixels, of the axis line
    @property axisLineY
    @type Number
    @readonly
  */
  axisLineY: property('orient', 'height', function(orient, height) {
    return orient === 'top' ? height : 0;
  }),
});
