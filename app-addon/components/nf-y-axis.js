import Ember from 'ember';
import { property } from '../utils/computed-property-helpers';
import HasGraphParent  from '../mixins/graph-has-graph-parent';

export default Ember.Component.extend(HasGraphParent, {
  tagName: 'g',
  tickCount: 5,
  tickLength: 5,
  tickPadding: 3,
  width: 40,
  orient: 'left',

  attributeBindings: ['transform'],

  classNameBindings: [':nf-y-axis', 'isOrientRight:orient-right:orient-left'],
  
  _tickFilter: null,

  tickFilter: function(name, value) {
    if(arguments.length > 1) {
      this._tickFilter = value;
    }
    return this._tickFilter;
  }.property(),

  isOrientRight: Ember.computed.equal('orient', 'right'),

  transform: function(){
    var x = this.get('x');
    var y = this.get('y');
    return 'translate(%@ %@)'.fmt(x, y);
  }.property('x', 'y'),

  x: function(){
    var orient = this.get('orient');
    if(orient !== 'left') {
      return this.get('graph.width') - this.get('width') - this.get('graph.paddingRight');
    }
    return this.get('graph.paddingLeft');
  }.property('orient', 'graph.width', 'width', 'graph.paddingLeft', 'graph.paddingRight'),

  y: function(){
    return this.get('graph.graphY');
  }.property('graph.graphY'),

  height: function(){
    return this.get('graph.height');
  }.property('graph.height'),

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

  uniqueYData: Ember.computed.uniq('graph.yData'),

  ticks: property('graph.yScale', 'tickCount', 'graph.yScaleType', 'tickPadding', 'axisLineX', 'tickLength', 'isOrientRight', 'tickFilter', 'uniqueYData',
    function(yScale, tickCount, yScaleType, tickPadding, axisLineX, tickLength, isOrientRight, tickFilter, uniqueYData) {
      var ticks = this.tickFactory(yScale, tickCount, uniqueYData, yScaleType);

      var result = ticks.map(function (tick) {
        return {
          value: tick,
          y: yScale(tick),
          x1: axisLineX + tickLength,
          x2: axisLineX,
          labelx: isOrientRight ? (tickLength + tickPadding) : (axisLineX - tickLength - tickPadding),
        };
      });

      if(tickFilter) {
        result = result.filter(tickFilter);
      }

      return result;
    }
  ),

  axisLineX: function(){
    var orient = this.get('orient');
    var width = this.get('width');
    return orient === 'right' ? 0 : width;
  }.property('orient', 'width'),

  _hasGraph: function(){
    var graph = this.get('graph');
    graph.set('yAxis', this);
  }.observes('graph')
});
