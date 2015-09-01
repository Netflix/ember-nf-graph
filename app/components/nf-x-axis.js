import Ember from 'ember';
import HasGraphParent from 'ember-nf-graph/mixins/graph-has-graph-parent';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import computed from 'ember-new-computed';
import layout from '../templates/components/nf-x-axis';

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
          {{#nf-x-axis height=40 as |tick|}}
            <text>x is {{tick.value}}</text>
          {{/nf-x-axis}}
        {{/nf-graph}}


  @namespace components
  @class nf-x-axis
  @extends Ember.Component
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequireScaleSource, {
  tagName: 'g',

  layout: layout,
  template: null,

  useTemplate: computed('hasBlock', 'template.blockParams', 'hasBlockParams', function(){
    var preGlimmerCheck = this.get('template.blockParams');
    var postGlimmerCheck = this.get('hasBlock') && this.get('hasBlockParams');
    return Boolean(postGlimmerCheck || preGlimmerCheck);
  }),

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

          {{#nf-x-axis tickFilter=myFilter as |tick|}}
            <text>{{tick.value}}</text>
          {{/nf-x-axis}}

    And on your controller:

          myFilter: function(tick, index, ticks) {
            return tick.value < 1000;
          },

    The above example will filter down the set of ticks to only those that are less than 1000.
  */
  tickFilter: computed.alias('_tickFilter'),

  /**
    The class applied due to orientation (e.g. `'orient-top'`)
    @property orientClass
    @type String
    @readonly
  */
  orientClass: computed('orient', function(){
    return 'orient-' + this.get('orient');
  }),

  /**
    The SVG Transform applied to this component's container.
    @property transform
    @type String
    @readonly
  */
  transform: computed('x', 'y', function(){
    var x = this.get('x') || 0;
    var y = this.get('y') || 0;
    return `translate(${x} ${y})`;
  }),

  /**
    The y position of this component's container.
    @property y
    @type Number
    @readonly
  */
  y: computed(
    'orient',
    'graph.paddingTop',
    'graph.paddingBottom',
    'graph.height',
    'height',
    function(){
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
    }
  ),

  /**
    This x position of this component's container
    @property x
    @type Number
    @readonly
  */
  x: computed('graph.graphX', function(){
    return this.get('graph.graphX') || 0;
  }),

  init() {
    this._super(...arguments);
    this.set('graph.xAxis', this);
  },

  /**
    The width of the component
    @property width
    @type Number
    @readonly
  */
  width: computed.alias('graph.graphWidth'),

  /**
    A method to call to override the default behavior of how ticks are created.

    The function signature should match:

          // - scale: d3.Scale
          // - tickCount: number of ticks
          // - uniqueData: unique data points for the axis
          // - scaleType: string of "linear" or "ordinal"
          // returns: an array of tick values.
          function(scale, tickCount, uniqueData, scaleType) {
            return [100,200,300];
          }

    @property tickFactory
    @type {Function}
    @default null
  */
  tickFactory: null,

  tickData: computed('xScale', 'graph.xScaleType', 'uniqueXData', 'tickCount', 'tickFactory', function(){
    var tickFactory = this.get('tickFactory');
    var scale = this.get('xScale');
    var uniqueData = this.get('uniqueXData');
    var tickCount = this.get('tickCount');
    var scaleType = this.get('graph.xScaleType');

    if(tickFactory) {
      return tickFactory(scale, tickCount, uniqueData, scaleType);
    }
    else if(scaleType === 'ordinal') {
      return uniqueData;
    } 
    else {
      return scale.ticks(tickCount);
    }
  }),

  /**
    A unique set of all x data on the graph
    @property uniqueXData
    @type Array
    @readonly
  */
  uniqueXData: computed.uniq('graph.xData'),

  /**
    The models for the ticks to display on the axis.
    @property ticks
    @type Array
    @readonly
  */
  ticks: computed(
    'xScale',
    'tickPadding',
    'tickLength',
    'height',
    'orient',
    'tickFilter',
    'tickData',
    'graph.xScaleType',
    function(){
      var xScale = this.get('xScale');
      var xScaleType = this.get('graph.xScaleType');
      var tickPadding = this.get('tickPadding');
      var tickLength = this.get('tickLength');
      var height = this.get('height');
      var orient = this.get('orient');
      var tickFilter = this.get('tickFilter');
      var ticks = this.get('tickData');
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

      return Ember.A(result);
    }
  ),

  /**
    The y position, in pixels, of the axis line
    @property axisLineY
    @type Number
    @readonly
  */
  axisLineY: computed('orient', 'height', function(){
    var orient = this.get('orient');
    var height = this.get('height');
    return orient === 'top' ? height : 0;
  })

});
