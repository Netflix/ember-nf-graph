import Ember from 'ember';
import HasGraphParent  from 'ember-nf-graph/mixins/graph-has-graph-parent';
import RequireScaleSource from 'ember-nf-graph/mixins/graph-requires-scale-source';
import computed from 'ember-new-computed';
import layout from '../templates/components/nf-y-axis';

/**
  A component for adding a templated y axis to an `nf-graph` component.
  All items contained within this component are used to template each tick mark on the 
  rendered graph. Tick values are supplied to the inner scope of this component on the
  view template via `tick`.
  
  ### Styling
  
  The main container will have a `nf-y-axis` class.
  A `orient-left` or `orient-right` container will be applied to the container
  depending on the `orient` setting.

  Ticks are positioned via a `<g>` tag, that will contain whatever is passed into it via
  templating, along with the tick line. `<text>` tags within tick templates do have some 
  default styling applied to them to position them appropriately based off of orientation.

  ### Example

        {{#nf-graph width=500 height=300}}
          {{#nf-y-axis width=40 as |tick|}}
            <text>y is {{tick.value}}</text>
          {{/nf-y-axis}}
        {{/nf-graph}}


  @namespace components
  @class nf-y-axis
  @uses mixins.graph-has-graph-parent
  @uses mixins.graph-requires-scale-source
*/
export default Ember.Component.extend(HasGraphParent, RequireScaleSource, {
  tagName: 'g',

  layout: layout,
  template: null,

  useTemplate: computed(function(){
    var preGlimmerCheck = this.get('template.blockParams');
    var postGlimmerCheck = this.get('hasBlock') && this.get('hasBlockParams');
    return Boolean(postGlimmerCheck || preGlimmerCheck);
  }),

  /**
    The number of ticks to display
    @property tickCount
    @type Number
    @default 5
  */
  tickCount: 5,

  /**
    The length of the tick's accompanying line.
    @property tickLength
    @type Number
    @default 5
  */
  tickLength: 5,

  /**
    The distance between the tick line and the origin tick's templated output
    @property tickPadding
    @type Number
    @default 3
  */
  tickPadding: 3,

  /**
    The total width of the y axis
    @property width
    @type Number
    @default 40
  */
  width: 40,

  /**
    The orientation of the y axis. Possible values are `'left'` and `'right'`
    @property orient
    @type String
    @default 'left'
  */
  orient: 'left',

  attributeBindings: ['transform'],

  classNameBindings: [':nf-y-axis', 'isOrientRight:orient-right:orient-left'],
  
  _tickFilter: null,

  /**
    An optional filtering function to allow more control over what tick marks are displayed.
    The function should have exactly the same signature as the function you'd use for an
    `Array.prototype.filter()`.
  
    @property tickFilter
    @type Function
    @default null
    @example

          {{#nf-y-axis tickFilter=myFilter as |tick|}}
            <text>{{tick.value}}</text>
          {{/nf-y-axis}}
  
    And on your controller:
    
          myFilter: function(tick, index, ticks) {
            return tick.value < 1000;
          },
  
    The above example will filter down the set of ticks to only those that are less than 1000.
  */
  tickFilter: computed({
    get() {
      return this._tickFilter;
    },
    set(name, value) {
      return this._tickFilter = value;
    }
  }),

  /**
    computed property. returns true if `orient` is equal to `'right'`.
    @property isOrientRight
    @type Boolean
    @readonly
  */
  isOrientRight: computed.equal('orient', 'right'),


  /**
    The SVG transform for positioning the component.
    @property transform
    @type String
    @readonly
  */
  transform: computed('x', 'y', function(){
    var x = this.get('x');
    var y = this.get('y');
    return `translate(${x} ${y})`;
  }),

  /**
    The x position of the component
    @property x
    @type Number
    @readonly
  */
  x: computed(
    'orient',
    'graph.width',
    'width',
    'graph.paddingLeft',
    'graph.paddingRight',
    function(){
      var orient = this.get('orient');
      if(orient !== 'left') {
        return this.get('graph.width') - this.get('width') - this.get('graph.paddingRight');
      }
      return this.get('graph.paddingLeft');
    }
  ),

  /**
    The y position of the component
    @property y
    @type Number
    @readonly
  */
  y: computed.alias('graph.graphY'),

  /** 
    the height of the component
    @property height
    @type Number
    @readonly
  */
  height: computed.alias('graph.height'),

  init() {
    this._super(...arguments);
    this.set('graph.yAxis', this);
  },

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

  tickData: computed('graph.yScaleType', 'uniqueYData', 'yScale', 'tickCount', function(){
    var tickFactory = this.get('tickFactory');
    var scale = this.get('yScale');
    var uniqueData = this.get('uniqueYData');
    var scaleType = this.get('graph.yScaleType');
    var tickCount = this.get('tickCount');

    if(tickFactory) {
      return tickFactory(scale, tickCount, uniqueData, scaleType);
    }
    else if(scaleType === 'ordinal') {
      return uniqueData;
    } 
    else {
      var ticks = scale.ticks(tickCount);
      if (scaleType === 'log') {
        var step = Math.round(ticks.length / tickCount);
        ticks = ticks.filter(function (tick, i) {
          return i % step === 0;
        });
      }
      return ticks;
    }
  }),

  /**
    All y data from the graph, filtered to unique values.
    @property uniqueYData
    @type Array
    @readonly
  */
  uniqueYData: computed.uniq('graph.yData'),

  /** 
    The ticks to be displayed.
    @property ticks
    @type Array
    @readonly
  */
  ticks: computed(
    'yScale',
    'tickPadding',
    'axisLineX',
    'tickLength',
    'isOrientRight',
    'tickFilter',
    function(){
      var yScale = this.get('yScale');
      var tickPadding = this.get('tickPadding');
      var axisLineX = this.get('axisLineX');
      var tickLength = this.get('tickLength');
      var isOrientRight = this.get('isOrientRight');
      var tickFilter = this.get('tickFilter');
      var ticks = this.get('tickData');
      var x1 = isOrientRight ? axisLineX + tickLength : axisLineX - tickLength;
      var x2 = axisLineX;
      var labelx = isOrientRight ? (tickLength + tickPadding) : (axisLineX - tickLength - tickPadding);

      var result = ticks.map(function (tick) {
        return {
          value: tick,
          y: yScale(tick),
          x1: x1,
          x2: x2,
          labelx: labelx,
        };
      });

      if(tickFilter) {
        result = result.filter(tickFilter);
      }

      return Ember.A(result);
    }
  ),


  /**
    The x position of the axis line.
    @property axisLineX
    @type Number
    @readonly
  */
  axisLineX: computed('isOrientRight', 'width', function(){
    return this.get('isOrientRight') ? 0 : this.get('width');
  }),
});
