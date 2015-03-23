import Ember from 'ember';
import HasGraphParent  from 'ember-cli-nf-graph/mixins/graph-has-graph-parent';
import RequireScaleSource from 'ember-cli-nf-graph/mixins/graph-requires-scale-source';

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
          {{#nf-y-axis width=40}}
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
  
          {{#nf-y-axis tickFilter=myFilter}} 
            <text>{{tick.value}}</text>
          {{/nf-y-axis}}
  
    And on your controller:
    
          myFilter: function(tick, index, ticks) {
            return tick.value < 1000;
          },
  
    The above example will filter down the set of ticks to only those that are less than 1000.
  */
  tickFilter: function(name, value) {
    if(arguments.length > 1) {
      this._tickFilter = value;
    }
    return this._tickFilter;
  }.property(),

  /**
    computed property. returns true if `orient` is equal to `'right'`.
    @property isOrientRight
    @type Boolean
    @readonly
  */
  isOrientRight: Ember.computed.equal('orient', 'right'),


  /**
    The SVG transform for positioning the component.
    @property transform
    @type String
    @readonly
  */
  transform: function(){
    var x = this.get('x');
    var y = this.get('y');
    return 'translate(%@ %@)'.fmt(x, y);
  }.property('x', 'y'),

  /**
    The x position of the component
    @property x
    @type Number
    @readonly
  */
  x: function(){
    var orient = this.get('orient');
    if(orient !== 'left') {
      return this.get('graph.width') - this.get('width') - this.get('graph.paddingRight');
    }
    return this.get('graph.paddingLeft');
  }.property('orient', 'graph.width', 'width', 'graph.paddingLeft', 'graph.paddingRight'),

  /**
    The y position of the component
    @property y
    @type Number
    @readonly
  */
  y: Ember.computed.alias('graph.graphY'),

  /** 
    the height of the component
    @property height
    @type Number
    @readonly
  */
  height: Ember.computed.alias('graph.height'),

  /**
    Function to create the tick values. Can be overriden to provide specific values.
    @method tickFactory
    @param yScale {Function} a d3 scale function
    @param tickCount {Number} the number of ticks desired
    @param uniqueYData {Array} all y data represented, filted to be unique (used for ordinal cases)
    @param yScaleType {String} the scale type of the containing graph.
    @return {Array} an array of domain values at which ticks should be placed.
  */
  tickFactory: function(yScale, tickCount, uniqueYData, yScaleType) {
    var ticks = yScaleType === 'ordinal' ? uniqueYData : yScale.ticks(tickCount);
    if (yScaleType === 'log') {
      var step = Math.round(ticks.length / tickCount);
      ticks = ticks.filter(function (tick, i) {
        return i % step === 0;
      });
    }
    return ticks;
  },

  /**
    All y data from the graph, filtered to unique values.
    @property uniqueYData
    @type Array
    @readonly
  */
  uniqueYData: Ember.computed.uniq('graph.yData'),

  /** 
    The ticks to be displayed.
    @property ticks
    @type Array
    @readonly
  */
  ticks: function(){
    var yScale = this.get('yScale');
    var tickCount = this.get('tickCount');
    var yScaleType = this.get('graph.yScaleType');
    var tickPadding = this.get('tickPadding');
    var axisLineX = this.get('axisLineX');
    var tickLength = this.get('tickLength');
    var isOrientRight = this.get('isOrientRight');
    var tickFilter = this.get('tickFilter');
    var uniqueYData = this.get('uniqueYData');
    var ticks = this.tickFactory(yScale, tickCount, uniqueYData, yScaleType);
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

    return result;
  }.property('yScale', 'tickCount', 'graph.yScaleType', 'tickPadding', 'axisLineX', 
    'tickLength', 'isOrientRight', 'tickFilter', 'uniqueYData'),


  /**
    The x position of the axis line.
    @property axisLineX
    @type Number
    @readonly
  */
  axisLineX: function(){
    return this.get('isOrientRight') ? 0 : this.get('width');
  }.property('isOrientRight', 'width'),

  /**
    sets graph's yAxis property on willInsertElement
    @method _updateGraphYAxis
    @private
  */
  _updateGraphYAxis: function(){
    this.set('graph.yAxis', this);
  }.on('willInsertElement')
});
